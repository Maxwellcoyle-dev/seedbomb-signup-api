import { generateCustomerId } from "../utils/generateCustomerId.mjs";

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient({});

export async function saveCustomerProfile({
  gym_name,
  slug,
  contact_email,
  tableName,
}) {
  const customer_id = generateCustomerId({ email: contact_email, slug });
  const timestamp = new Date().toISOString();

  const item = {
    customer_id: { S: customer_id },
    gym_name: { S: gym_name },
    slug: { S: slug },
    contact_email: { S: contact_email },
    status: { S: "pending" },
    signup_timestamp: { S: timestamp },
  };

  const command = new PutItemCommand({
    TableName: tableName,
    Item: item,
    ConditionExpression: "attribute_not_exists(customer_id)",
  });

  try {
    await dynamo.send(command);
    return { success: true, customer_id };
  } catch (err) {
    if (err.name === "ConditionalCheckFailedException") {
      console.warn("Customer already exists with this ID.");
      return { success: false, reason: "Customer already exists." };
    }
    throw err;
  }
}
