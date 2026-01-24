import {
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v7 as uuidv7 } from "uuid";
import { ERROR_CODES } from "../constants/error";
import type { ChatMessageItems, ChatRoomItems } from "../types/chat";
import type { ResultResponse } from "../types/result";
import { dynamoDBDocClient } from "../utils/dynamodb";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { errorResponse, successResponse } from "../utils/response";

// チャットルーム新規作成
export const createChatRoom = async (
	userId: string,
): Promise<ResultResponse<ChatRoomItems>> => {
	const timestamp = new Date().toISOString();
	try {
		const chatRoomData: ChatRoomItems = {
			userId,
			roomId: uuidv7(),
			title: "New Chat",
			createdAt: timestamp,
			updatedAt: timestamp,
		};
		await dynamoDBDocClient.send(
			new PutCommand({
				TableName: process.env.CHATROOMS_TABLE_NAME,
				Item: chatRoomData,
			}),
		);
		logger.info("Successfully to create chatRoom in DynamoDB", {
			userId,
			roomId: chatRoomData.roomId,
		});
		return successResponse(chatRoomData);
	} catch (error) {
		logger.error("Failed to create chatRoom in DynamoDB", toError(error));
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// チャットメッセージ作成
export const addMessage = async (
	userId: string,
	roomId: string,
	role: "user" | "assistant",
	content: string,
): Promise<ResultResponse<ChatMessageItems>> => {
	const timestamp = new Date().toISOString();
	try {
		const chatMessageData: ChatMessageItems = {
			roomId,
			createdAt: timestamp,
			userId,
			chatMessageId: uuidv7(),
			role,
			content,
		};
		await dynamoDBDocClient.send(
			new PutCommand({
				TableName: process.env.CHATMESSAGES_TABLE_NAME,
				Item: chatMessageData,
			}),
		);
		logger.info(`Successfully to add ${role}'s chatMessage in DynamoDB`, {
			userId,
			roomId: chatMessageData.roomId,
		});
		return successResponse(chatMessageData);
	} catch (error) {
		logger.error(
			`Failed to add ${role}'s chatMessage in DynamoDB`,
			toError(error),
		);
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// チャットルームを更新
export const updateChatRoom = async (
	userId: string,
	roomId: string,
	title?: string,
): Promise<ResultResponse<ChatRoomItems>> => {
	try {
		// 更新に使用するパラメータを動的に組み立て
		// リクエストで指定されたフィールドのみ更新する
		const updateExpression = [];
		const expressionAttributeNames: Record<string, "title" | "updatedAt"> = {};
		const expressionAttributeValues: Record<string, string> = {};
		const timestamp = new Date().toISOString();

		if (title) {
			updateExpression.push("#title = :title");
			expressionAttributeNames["#title"] = "title";
			expressionAttributeValues[":title"] = title;
		}
		// updatedAtは常時更新
		updateExpression.push("#updatedAt = :updatedAt");
		expressionAttributeNames["#updatedAt"] = "updatedAt";
		expressionAttributeValues[":updatedAt"] = timestamp;

		const result = await dynamoDBDocClient.send(
			new UpdateCommand({
				TableName: process.env.CHATROOMS_TABLE_NAME,
				Key: {
					userId,
					roomId,
				},
				UpdateExpression: `set ${updateExpression.join(", ")}`,
				ExpressionAttributeNames: expressionAttributeNames,
				ExpressionAttributeValues: expressionAttributeValues,
				ReturnValues: "ALL_NEW",
				ConditionExpression:
					"attribute_exists(userId) AND attribute_exists(roomId)",
			}),
		);
		logger.info("Successfully to update chatRoom in DynamoDB", {
			userId,
			roomId,
		});
		return successResponse(result.Attributes as ChatRoomItems);
	} catch (error) {
		const err = toError(error);
		if (err.name === "ConditionalCheckFailedException") {
			logger.info("Not found the chatRoom for update in DynamoDB", {
				userId,
				roomId,
			});
			return errorResponse(ERROR_CODES.CHATROOM_NOT_FOUND);
		}
		logger.error("Failed to update chatRoom in DynamoDB", err);
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// 特定のチャットルーム取得
export const getChatRoom = async (
	userId: string,
	roomId: string,
): Promise<ResultResponse<ChatRoomItems>> => {
	try {
		const result = await dynamoDBDocClient.send(
			new GetCommand({
				TableName: process.env.CHATROOMS_TABLE_NAME,
				Key: {
					userId,
					roomId,
				},
			}),
		);
		if (!result.Item) {
			logger.info("Not found the roomId in DynamoDB", {
				userId,
				roomId,
			});
			return errorResponse(ERROR_CODES.CHATROOM_NOT_FOUND);
		}
		logger.info("Successfully to get roomId in DynamoDB", {
			userId,
			roomId,
		});
		return successResponse(result.Item as ChatRoomItems);
	} catch (error) {
		logger.error("Failed to get roomId in DynamoDB", toError(error));
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// チャットルーム一覧を取得
export const getChatRooms = async (
	userId: string,
): Promise<ResultResponse<ChatRoomItems[]>> => {
	try {
		const result = await dynamoDBDocClient.send(
			new QueryCommand({
				TableName: process.env.CHATROOMS_TABLE_NAME,
				KeyConditionExpression: "userId=:userId",
				ExpressionAttributeValues: { ":userId": userId },
			}),
		);
		if (!result.Items) {
			logger.info("Not found the chatRooms in DynamoDB", {
				userId,
			});
			return successResponse([]);
		}
		logger.info("Successfully to get chatRooms in DynamoDB", {
			userId,
			totalChatRooms: result.Items.length,
		});
		return successResponse(result.Items as ChatRoomItems[]);
	} catch (error) {
		logger.error("Failed to get chatRooms in DynamoDB", toError(error));
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// チャットルームのメッセージ一覧を取得
export const getChatMessages = async (
	roomId: string,
): Promise<ResultResponse<ChatMessageItems[]>> => {
	try {
		const result = await dynamoDBDocClient.send(
			new QueryCommand({
				TableName: process.env.CHATMESSAGES_TABLE_NAME,
				KeyConditionExpression: "roomId=:roomId",
				ExpressionAttributeValues: { ":roomId": roomId },
			}),
		);
		if (!result.Items) {
			logger.info("Not found the chatMessages in DynamoDB", {
				roomId,
			});
			return successResponse([]);
		}
		logger.info("Successfully to get chatMessages in DynamoDB", {
			roomId,
			totalChatMessages: result.Items.length,
		});
		return successResponse(result.Items as ChatMessageItems[]);
	} catch (error) {
		logger.error("Failed to get chatMessages in DynamoDB", toError(error));
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};
