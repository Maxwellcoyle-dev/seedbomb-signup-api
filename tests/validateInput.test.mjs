import { describe, it, expect } from "vitest";
import { validateAndNormalize } from "../src/utils/validateInput.mjs";

describe("validateAndNormalize", () => {
  it("returns valid=true with normalized data for valid input", () => {
    const result = validateAndNormalize({
      gym_name: " Iron Temple ",
      contact_email: "OWNER@IronTemple.com ",
      template_id: " template-1 ",
    });

    expect(result.valid).toBe(true);
    expect(result.normalized).toEqual({
      gym_name: "Iron Temple",
      contact_email: "owner@irontemple.com",
      template_id: "template-1",
      slug: "iron-temple",
    });
  });

  it("returns errors if required fields are missing", () => {
    const result = validateAndNormalize({});

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("gym_name is required");
    expect(result.errors).toContain("contact_email is required");
    expect(result.errors).toContain("template_id is required");
  });
});
