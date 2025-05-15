import { describe, it, expect, vi } from "vitest";
import { saveCustomerProfile } from "../src/modules/saveCustomer.mjs";
import { generateCustomerId } from "../src/utils/generateCustomerId.mjs";

// 🧪 Stub a predictable ID
vi.mock("../src/utils/generateCustomerId.mjs", () => ({
  generateCustomerId: vi.fn(() => "mocked-id-123"),
}));

describe("saveCustomerProfile", () => {
  const mockClient = { send: vi.fn() };
  const input = {
    gym_name: "Test Gym",
    slug: "test-gym",
    contact_email: "owner@testgym.com",
    tableName: "test-customers",
  };

  it("saves a new customer successfully", async () => {
    mockClient.send.mockResolvedValueOnce({});

    const result = await saveCustomerProfile(input, mockClient);
    expect(result).toEqual({ success: true, customer_id: "mocked-id-123" });
    expect(mockClient.send).toHaveBeenCalledOnce();
  });

  it("returns false if customer already exists", async () => {
    const error = new Error("Conflict");
    error.name = "ConditionalCheckFailedException";
    mockClient.send.mockRejectedValueOnce(error);

    const result = await saveCustomerProfile(input, mockClient);
    expect(result).toEqual({
      success: false,
      reason: "Customer already exists.",
    });
  });

  it("throws if an unexpected error occurs", async () => {
    const error = new Error("Network down");
    mockClient.send.mockRejectedValueOnce(error);

    await expect(saveCustomerProfile(input, mockClient)).rejects.toThrow(
      "Network down"
    );
  });
});
