import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ERROR_CODES } from "../constants/error";
import type { DiaryItems } from "../types/diary";
import type { ResultResponse } from "../types/result";
import { DynamoDBDocClient } from "../utils/dynamodb";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { errorResponse, successResponse } from "../utils/response";

// 日記全取得
export const getDiaries = async (
	userId: string,
): Promise<ResultResponse<DiaryItems[]>> => {
	try {
		const result = await DynamoDBDocClient.send(
			new QueryCommand({
				TableName: process.env.DIARIES_TABLE_NAME,
				KeyConditionExpression: "userId = :userId",
				ExpressionAttributeValues: {
					":userId": userId,
				},
			}),
		);
		if (result.Items === undefined) {
			return successResponse([]);
		}
		logger.info("Successfully to fetch diaries from DynamoDB", {
			userId,
			count: result.Items.length,
		});
		return successResponse(result.Items as DiaryItems[]);
	} catch (error) {
		logger.error("Failed to fetch diaries from DynamoDB:", toError(error));
	}
	return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
};
