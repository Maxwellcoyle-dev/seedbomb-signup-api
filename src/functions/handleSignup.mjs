// modules
import { validateAndNormalize } from "../modules/validateInput.mjs";
import { saveCustomerProfile } from "../modules/saveCustomer.mjs";
import { emitCustomerSignupCompleted } from "../modules/emitEvent.mjs";

// utils
import { response } from "../utils/response.mjs";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { valid, errors, normalized } = validateAndNormalize(body);

    if (!valid) {
      return response(422, { message: "Validation failed", errors });
    }

    const tableName = process.env.CUSTOMERS_TABLE_NAME;
    if (!tableName) {
      console.error("CUSTOMERS_TABLE_NAME is not defined in env vars");
      return response(500, { message: "Server misconfiguration" });
    }

    const saveResult = await saveCustomerProfile({
      gym_name: normalized.gym_name,
      contact_email: normalized.contact_email,
      slug: normalized.slug,
      tableName,
    });

    if (!saveResult.success) {
      return response(409, {
        message: "Customer already exists",
        reason: saveResult.reason,
      });
    }

    // ✅ Now emit the event using the same `normalized` input + saved ID
    try {
      const emitResult = await emitCustomerSignupCompleted({
        customer_id: saveResult.customer_id,
        contact_email: normalized.contact_email,
        slug: normalized.slug,
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

    return response(200, {
      message: "Signup successful",
      customer_id: saveResult.customer_id,
    });
  } catch (err) {
    console.error("Error handling signup:", err);
    return response(400, {
      message: "Something went wrong",
      error: err.message,
    });
  }
};
