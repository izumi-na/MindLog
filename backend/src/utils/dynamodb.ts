import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

if (!process.env.REGION) {
	throw new Error("Environment variables REGION must be set");
}

const client = new DynamoDBClient({ region: process.env.REGION });

export const DynamoDBDocClient = DynamoDBDocumentClient.from(client, {
	marshallOptions: {
		removeUndefinedValues: true, // undefinedの値を削除
	},
});
