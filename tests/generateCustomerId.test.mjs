import { describe, it, expect } from "vitest";

import { generateCustomerId } from "../src/utils/generateCustomerId.mjs";

describe("generateCustomerId", () => {
  it("produces a consistent hash for the same email and slug", () => {
    const id1 = generateCustomerId({
      email: "owner@gym.com",
      slug: "iron-temple",
    });
    const id2 = generateCustomerId({
      email: "owner@gym.com",
      slug: "iron-temple",
    });

    expect(id1).toBe(id2);
  });

  it("produces different hashes for different emails or slugs", () => {
    const id1 = generateCustomerId({
      email: "owner@gym.com",
      slug: "iron-temple",
    });
    const id2 = generateCustomerId({
      email: "new@gym.com",
      slug: "iron-temple",
    });
    const id3 = generateCustomerId({
      email: "owner@gym.com",
      slug: "iron-den",
    });

    expect(id1).not.toBe(id2);
    expect(id1).not.toBe(id3);
  });

  it("produces a 32-character hash", () => {
    const id = generateCustomerId({
      email: "owner@gym.com",
      slug: "iron-temple",
    });
    expect(id.length).toBe(32);
  });
});
