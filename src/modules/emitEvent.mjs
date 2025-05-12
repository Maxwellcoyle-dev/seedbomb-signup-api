import {
  EventBridgeClient,
  PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

const eventBridge = new EventBridgeClient({});

export async function emitCustomerSignupCompleted({ customer_id, slug, plan }) {
  const eventBusName = process.env.EVENT_BUS_NAME;

  const detail = {
    customer_id,
    slug,
    plan,
  };

  const eventPayload = {
    Source: "seedbomb.signup",
    DetailType: "CustomerSignupCompleted",
    EventBusName: eventBusName,
    Time: new Date(),
    Detail: JSON.stringify(detail),
  };

  const command = new PutEventsCommand({ Entries: [eventPayload] });

  try {
    const result = await eventBridge.send(command);
    const failed = result.FailedEntryCount || 0;

    if (failed > 0) {
      console.warn("⚠️ EventBridge reported failed entry:", result);
      return { success: false, error: result };
    }

    console.log("✅ Event emitted successfully:", {
      customer_id,
      eventId: result.Entries?.[0]?.EventId,
    });

    return { success: true };
  } catch (err) {
    console.error("❌ Failed to emit EventBridge event:", {
      customer_id,
      error: err.message,
    });

    return { success: false, error: err };
  }
}
