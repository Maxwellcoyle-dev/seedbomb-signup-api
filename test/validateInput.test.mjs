import { describe, it, expect } from "vitest";
import { validateAndNormalize } from "../src/modules/validateInput.mjs";
import { errors as errorCodes } from "../src/utils/errors.mjs";

describe("validateAndNormalize", () => {
  it("returns valid: true and normalized data when all fields are provided", () => {
    const input = {
      gym_name: "  Iron Temple  ",
      contact_email: "OWNER@irontemple.FIT ",
      template_id: " template-1 ",
      slug: " IRON-temple  ",
    };

    const result = validateAndNormalize(input);

    expect(result.valid).toBe(true);
    expect(result.normalized).toEqual({
      gym_name: "Iron Temple",
      contact_email: "owner@irontemple.fit",
      template_id: "template-1",
      slug: "iron-temple",
    });
  });

  it("returns errors for missing fields", () => {
    const input = {};
    const result = validateAndNormalize(input);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      { field: "gym_name", code: errorCodes.MISSING_GYM_NAME },
      { field: "contact_email", code: errorCodes.MISSING_CONTACT_EMAIL },
      { field: "template_id", code: errorCodes.MISSING_TEMPLATE_ID },
      { field: "slug", code: errorCodes.MISSING_SLUG },
    ]);
  });

  it("returns trimmed and formatted email and slug", () => {
    const input = {
      gym_name: " Gym ",
      contact_email: " Test@Example.com ",
      template_id: "abc",
      slug: " My Slug  ",
    };

    const result = validateAndNormalize(input);

    expect(result.valid).toBe(true);
    expect(result.normalized.contact_email).toBe("test@example.com");
    expect(result.normalized.slug).toBe("my-slug");
  });
});
