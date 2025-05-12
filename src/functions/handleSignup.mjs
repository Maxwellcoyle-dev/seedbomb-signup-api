import { validateAndNormalize } from "../utils/validateInput.mjs";
import { saveCustomerProfile } from "../utils/saveCustomer.mjs";
import { response } from "../utils/response.mjs";

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { valid, errors, normalized } = validateAndNormalize(body);

    if (!valid) {
      return response(422, { message: "Validation failed", errors });
    }

    console.log("Signup normalized:", normalized);

    const tableName = process.env.CUSTOMERS_TABLE_NAME;
    console.log("env variable tablename: ", tableName);
    if (!tableName)
      throw new Error("CUSTOMERS_TABLE_NAME is not defined in env vars");

    const result = await saveCustomerProfile({
      gym_name: normalized.gym_name,
      contact_email: normalized.contact_email,
      slug: normalized.slug,
      tableName,
    });

    if (!result.success) {
      return response(409, {
        message: "Customer already exists",
        reason: result.reason,
      });
    }

    return response(200, {
      message: "Signup successful",
      customer_id: result.customer_id,
    });
  } catch (err) {
    console.error("Error handling signup:", err);
    return response(400, {
      message: "Something went wrong",
      error: err.message,
    });
  }
};
