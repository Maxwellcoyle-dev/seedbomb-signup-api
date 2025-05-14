export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumerics with hyphen
    .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens
}
