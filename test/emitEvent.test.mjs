import { describe, it, expect } from "vitest";
import { emitCustomerSignupCompleted } from "../src/modules/emitEvent.mjs";

describe("emitCustomerSignupCompleted", () => {
  const customer_id = "abc123";
  const slug = "biceps-gym";
  const plan = "starter";
  const envVars = { EVENT_BUS_NAME: "test-bus" };

  const baseEvent = { customer_id, slug, plan };

  it("returns success when EventBridge reports no failures", async () => {
    const mockClient = {
      send: async () => ({
        FailedEntryCount: 0,
        Entries: [{ EventId: "evt-123" }],
      }),
    };

    process.env.EVENT_BUS_NAME = envVars.EVENT_BUS_NAME;

    const result = await emitCustomerSignupCompleted(baseEvent, mockClient);
    expect(result).toEqual({ success: true });
  });

  it("returns failure when EventBridge reports failed entry", async () => {
    const mockClient = {
      send: async () => ({
        FailedEntryCount: 1,
        Entries: [{}],
      }),
    };

    process.env.EVENT_BUS_NAME = envVars.EVENT_BUS_NAME;

    const result = await emitCustomerSignupCompleted(baseEvent, mockClient);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("returns failure when client.send throws an error", async () => {
    const mockClient = {
      send: async () => {
        throw new Error("Connection error");
      },
    };

    process.env.EVENT_BUS_NAME = envVars.EVENT_BUS_NAME;

    const result = await emitCustomerSignupCompleted(baseEvent, mockClient);
    expect(result.success).toBe(false);
    expect(result.error.message).toBe("Connection error");
  });
});
