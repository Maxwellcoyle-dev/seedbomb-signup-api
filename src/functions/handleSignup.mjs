// modules
import { validateAndNormalize } from "../modules/validateInput.mjs";
import { saveCustomerProfile } from "../modules/saveCustomer.mjs";
import { emitCustomerSignupCompleted } from "../modules/emitEvent.mjs";
import { checkSlugAvailability } from "../modules/checkSlugAvailability.mjs";

// utils
import { response } from "../utils/response.mjs";
import { errors as errorCodes } from "../utils/errors.mjs";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    console.info("Incoming signup request", {
      ip: event.requestContext?.identity?.sourceIp,
      userAgent: event.headers?.["User-Agent"],
      bodySummary: {
        gym_name: body.gym_name,
        slug: body.slug,
        contact_email_domain: body.contact_email?.split("@")[1],
      },
    });

    const { valid, errors, normalized } = validateAndNormalize(body);

    if (!valid) {
      return response(422, { message: "Validation failed", errors });
    }

    const tableName = process.env.CUSTOMERS_TABLE_NAME;
    if (!tableName) {
      console.error("❌ Server error", {
        message: "Server misconfiguration. tableName not found.",
        errors: [{ code: errorCodes.INTERNAL_SERVER_ERROR }],
      });

      return response(500, {
        message: "Server misconfiguration. tableName not found.",
        errors: [{ code: errorCodes.INTERNAL_SERVER_ERROR }],
      });
    }

    const slug = normalized.slug;
    // check for slug availability
    const available = await checkSlugAvailability(slug, tableName);
    if (!available) {
      console.error("❌ Error saving customer", {
        message: "Slug is already taken",
        errors: [{ field: "slug", code: errorCodes.SLUG_NOT_UNIQUE }],
      });

      return response(409, {
        message: "Slug is already taken",
        errors: [{ field: "slug", code: errorCodes.SLUG_NOT_UNIQUE }],
      });
    }

    const saveResult = await saveCustomerProfile({
      gym_name: normalized.gym_name,
      contact_email: normalized.contact_email,
      slug,
      tableName,
    });

    if (!saveResult.success) {
      console.error("❌ Error saving customer", {
        message: "Customer already exists",
        errors: [
          { field: "contact_email", code: errorCodes.CUSTOMER_ALREADY_EXISTS },
        ],
      });

      return response(409, {
        message: "Customer already exists",
        errors: [
          { field: "contact_email", code: errorCodes.CUSTOMER_ALREADY_EXISTS },
        ],
      });
    }

    // ✅ Now emit the event using the same `normalized` input + saved ID
    try {
      const emitResult = await emitCustomerSignupCompleted({
        customer_id: saveResult.customer_id,
        contact_email: normalized.contact_email,
        slug,
        gym_name: normalized.gym_name,
        template_id: normalized.template_id,
      });

      if (!emitResult.success) {
        console.warn(
          "⚠️ Event emitted with partial failure:",
          emitResult.error
        );
      }
    } catch (emitErr) {
      console.error("❌ Event emission threw an unexpected error:", emitErr);
    }

    console.info("✅ Signup completed", {
      customer_id: saveResult.customer_id,
      slug,
    });

    return response(200, {
      message: "Signup successful",
      customer_id: saveResult.customer_id,
    });
  } catch (err) {
    console.error("❌ Unexpected error during signup", {
      error: err.message,
      stack: err.stack,
    });
    console.error("Error handling signup:", err);
    return response(400, {
      message: "Something went wrong",
      errors: [{ code: errorCodes.INTERNAL_SERVER_ERROR, detail: err.message }],
    });
  }
};
