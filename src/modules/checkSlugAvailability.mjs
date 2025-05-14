import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

const dynamo = new DynamoDBClient({});

export async function checkSlugAvailability(slug, tableName) {
  console.log("slug: ", slug);
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

  const result = await dynamo.send(command);
  return result.Count === 0;
}
