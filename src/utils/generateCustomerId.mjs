import crypto from "crypto";

export function generateCustomerId({ email, slug }) {
  return crypto
    .createHash("sha256")
    .update(`${email}:${slug}`)
    .digest("hex")
    .slice(0, 32);
}
