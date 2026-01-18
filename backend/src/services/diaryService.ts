import {
	DeleteCommand,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v7 as uuidv7 } from "uuid";
import { ERROR_CODES } from "../constants/error";
import type {
	CreateDiaryRequest,
	CreateDiaryRequestKeys,
	DiaryItems,
} from "../types/diary";
import type { ResultResponse } from "../types/result";
import { dynamoDBDocClient } from "../utils/dynamodb";
import { getEmbedding } from "../utils/embeddings";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { errorResponse, successResponse } from "../utils/response";

// 日記全取得
export const getDiaries = async (
	userId: string,
): Promise<ResultResponse<DiaryItems[]>> => {
	try {
		const result = await dynamoDBDocClient.send(
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

// 日記新規登録
export const createDiary = async (
	userId: string,
	params: CreateDiaryRequest,
): Promise<ResultResponse<DiaryItems>> => {
	const timestamp = new Date().toISOString();
	try {
		const embeddingData = await getEmbedding(params.content);
		const diaryData = {
			userId: userId,
			diaryId: uuidv7(),
			date: params.date,
			title: params.title,
			content: params.content,
			feeling: params.feeling,
			embedding: embeddingData,
			createdAt: timestamp,
			updatedAt: timestamp,
		};
		await dynamoDBDocClient.send(
			new PutCommand({
				TableName: process.env.DIARIES_TABLE_NAME,
				Item: diaryData,
			}),
		);
		logger.info("Successfully to create diary in DynamoDB:", {
			userId,
			diaryId: diaryData.diaryId,
		});
		return successResponse(diaryData);
	} catch (error) {
		logger.error("Failed to create diary in DynamoDB:", toError(error));
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// 日記物理削除
export const deleteDiary = async (
	userId: string,
	diaryId: string,
): Promise<ResultResponse<DiaryItems>> => {
	try {
		const result = await dynamoDBDocClient.send(
			new DeleteCommand({
				TableName: process.env.DIARIES_TABLE_NAME,
				Key: {
					userId,
					diaryId,
				},
				ReturnValues: "ALL_OLD",
			}),
		);
		if (!result.Attributes) {
			logger.info("Not found the diary for deletion in DynamoDB:", {
				userId,
				diaryId,
			});
			return errorResponse(ERROR_CODES.DIARY_NOT_FOUND);
		}
		logger.info("Successfully to delete diary in DynamoDB:", {
			userId,
			diaryId,
		});
		return successResponse(result.Attributes as DiaryItems);
	} catch (error) {
		logger.error("Failed to delete diary in DynamoDB:", toError(error));
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// 特定の日記取得
export const getDiary = async (
	userId: string,
	diaryId: string,
): Promise<ResultResponse<DiaryItems>> => {
	try {
		const result = await dynamoDBDocClient.send(
			new GetCommand({
				TableName: process.env.DIARIES_TABLE_NAME,
				Key: {
					userId,
					diaryId,
				},
			}),
		);
		if (!result.Item) {
			logger.info("Not found the diary in DynamoDB:", {
				userId,
				diaryId,
			});
			return errorResponse(ERROR_CODES.DIARY_NOT_FOUND);
		}
		logger.info("Successfully to get diary in DynamoDB:", {
			userId,
			diaryId,
		});
		return successResponse(result.Item as DiaryItems);
	} catch (error) {
		logger.error("Failed to get diary in DynamoDB:", toError(error));
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// 特定の日記更新
export const updateDiary = async (
	userId: string,
	diaryId: string,
	params: CreateDiaryRequest,
): Promise<ResultResponse<DiaryItems>> => {
	try {
		// 更新に使用するパラメータを動的に組み立て
		// リクエストで指定されたフィールドのみ更新する
		const updateExpression = [];
		const expressionAttributeNames: Record<
			string,
			CreateDiaryRequestKeys | "updatedAt" | "embedding"
		> = {};
		const expressionAttributeValues: Record<string, string | number[]> = {};

		const timestamp = new Date().toISOString();

		if (params.date) {
			updateExpression.push("#date = :date");
			expressionAttributeNames["#date"] = "date";
			expressionAttributeValues[":date"] = params.date;
		}
		if (params.title) {
			updateExpression.push("#title = :title");
			expressionAttributeNames["#title"] = "title";
			expressionAttributeValues[":title"] = params.title;
		}
		if (params.content) {
			updateExpression.push("#content = :content");
			expressionAttributeNames["#content"] = "content";
			expressionAttributeValues[":content"] = params.content;

			// embeddingデータも更新を実施
			const embeddingData = await getEmbedding(params.content);
			updateExpression.push("#embedding = :embedding");
			expressionAttributeNames["#embedding"] = "embedding";
			expressionAttributeValues[":embedding"] = embeddingData;
		}
		if (params.feeling) {
			updateExpression.push("#feeling = :feeling");
			expressionAttributeNames["#feeling"] = "feeling";
			expressionAttributeValues[":feeling"] = params.feeling;
		}

		// updatedAtは常時更新
		updateExpression.push("#updatedAt = :updatedAt");
		expressionAttributeNames["#updatedAt"] = "updatedAt";
		expressionAttributeValues[":updatedAt"] = timestamp;

		const result = await dynamoDBDocClient.send(
			new UpdateCommand({
				TableName: process.env.DIARIES_TABLE_NAME,
				Key: {
					userId,
					diaryId,
				},
				UpdateExpression: `set ${updateExpression.join(", ")}`,
				ExpressionAttributeNames: expressionAttributeNames,
				ExpressionAttributeValues: expressionAttributeValues,
				ReturnValues: "ALL_NEW",
				ConditionExpression:
					"attribute_exists(userId) AND attribute_exists(diaryId)",
			}),
		);
		logger.info("Successfully to update diary in DynamoDB:", {
			userId,
			diaryId,
		});
		return successResponse(result.Attributes as DiaryItems);
	} catch (error) {
		const err = toError(error);
		if (err.name === "ConditionalCheckFailedException") {
			logger.info("Not found the diary for update in DynamoDB:", {
				userId,
				diaryId,
			});
			return errorResponse(ERROR_CODES.DIARY_NOT_FOUND);
		}
		logger.error("Failed to update diary in DynamoDB:", err);
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};
