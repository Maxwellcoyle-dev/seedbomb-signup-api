import { describe, it, expect } from "vitest";
import { checkSlugAvailability } from "../src/modules/checkSlugAvailability.mjs";

describe("checkSlugAvailability", () => {
  const tableName = "test-table";
  const slug = "iron-temple";

  const mockClient = {
    send: async () => ({ Count: 0 }), // Default mock behavior
  };

  it("returns true when no existing slug found", async () => {
    mockClient.send = async () => ({ Count: 0 });

    const result = await checkSlugAvailability(slug, tableName, mockClient);
    expect(result).toBe(true);
  });

  it("returns false when slug already exists", async () => {
    mockClient.send = async () => ({ Count: 1 });

    const result = await checkSlugAvailability(slug, tableName, mockClient);
    expect(result).toBe(false);
  });
});
