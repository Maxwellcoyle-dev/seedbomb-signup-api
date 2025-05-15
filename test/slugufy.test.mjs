import { describe, it, expect } from "vitest";
import { slugify } from "../src/utils/slugify.mjs";

describe("slugify", () => {
  it("converts a basic string to kebab-case", () => {
    expect(slugify("Iron Temple")).toBe("iron-temple");
  });

  it("trims leading and trailing whitespace", () => {
    expect(slugify("  Iron Temple  ")).toBe("iron-temple");
  });

  it("replaces multiple non-alphanumeric characters with single hyphen", () => {
    expect(slugify("Iron@Temple!!!Now")).toBe("iron-temple-now");
  });

  it("removes leading/trailing hyphens from result", () => {
    expect(slugify(" ---Iron Temple--- ")).toBe("iron-temple");
  });

  it("handles mixed case and numbers", () => {
    expect(slugify("Gym24/7")).toBe("gym24-7");
  });

  it("returns an empty string if input is only whitespace", () => {
    expect(slugify("   ")).toBe("");
  });

  it("returns an empty string if input is empty", () => {
    expect(slugify("")).toBe("");
  });
});
