import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

export async function checkSlugAvailability(
  slug,
  tableName,
  client = new DynamoDBClient({})
) {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: "slug-index",
    KeyConditionExpression: "#s = :slug",
    ExpressionAttributeNames: { "#s": "slug" },
    ExpressionAttributeValues: {
      ":slug": { S: slug },
    },
    Limit: 1,
  });

  const result = await client.send(command);
  return result.Count === 0;
}
