export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { gym_name, contact_email, template_id } = body;

    // Basic validation
    if (!gym_name || !contact_email || !template_id) {
      return response(422, {
        message:
          "Missing one or more required fields: gym_name, contact_email, template_id",
      });
    }

    // TODO: Store in DynamoDB (placeholder log for now)
    console.log("New signup received:", {
      gym_name,
      contact_email,
      template_id,
    });

    return response(200, {
      message: "Signup received successfully",
    });
  } catch (err) {
    console.error("Error handling signup:", err);
    return response(400, {
      message: "Invalid request format",
      error: err.message,
    });
  }
};

// Helper to format responses
const response = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
