import { slugify } from "../utils/slugify.mjs";
import { errors as errorCodes } from "../utils/errors.mjs";

export function validateAndNormalize(input = {}) {
  const errors = [];

  const rawGymName = input.gym_name?.trim();
  const rawEmail = input.contact_email?.trim().toLowerCase();
  const rawTemplateId = input.template_id?.trim();
  const rawSlug = input.slug?.trim().toLowerCase();

  if (!rawGymName)
    errors.push({ field: "gym_name", code: errorCodes.MISSING_GYM_NAME });
  if (!rawEmail)
    errors.push({
      field: "contact_email",
      code: errorCodes.MISSING_CONTACT_EMAIL,
    });
  if (!rawTemplateId)
    errors.push({ field: "template_id", code: errorCodes.MISSING_TEMPLATE_ID });
  if (!rawSlug) errors.push({ field: "slug", code: errorCodes.MISSING_SLUG });

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    normalized: {
      gym_name: rawGymName,
      contact_email: rawEmail,
      template_id: rawTemplateId,
      slug: slugify(rawSlug), // clean up user-provided slug
    },
  };
}
