export function validateAndNormalize(input = {}) {
  const errors = [];

  const rawGymName = input.gym_name?.trim();
  const rawEmail = input.contact_email?.trim().toLowerCase();
  const rawTemplateId = input.template_id?.trim();

  if (!rawGymName) errors.push("gym_name is required");
  if (!rawEmail) errors.push("contact_email is required");
  if (!rawTemplateId) errors.push("template_id is required");

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    normalized: {
      gym_name: rawGymName,
      contact_email: rawEmail,
      template_id: rawTemplateId,
      slug: slugify(rawGymName),
    },
  };
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumerics with hyphen
    .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens
}
