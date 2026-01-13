import { DeleteCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { v7 as uuidv7 } from "uuid";
import { ERROR_CODES } from "../constants/error";
import type { CreateDiaryRequest, DiaryItems } from "../types/diary";
import type { ResultResponse } from "../types/result";
import { dynamoDBDocClient } from "../utils/dynamodb";
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
	const diaryData = {
		userId: userId,
		diaryId: uuidv7(),
		date: params.date,
		content: params.content,
		feeling: params.feeling,
		createdAt: timestamp,
		updatedAt: timestamp,
	};
	try {
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
