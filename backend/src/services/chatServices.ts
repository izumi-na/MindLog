import { PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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
		logger.info("Successfully to create chatRoom in DynamoDB:", {
			userId,
			roomId: chatRoomData.roomId,
		});
		return successResponse(chatRoomData);
	} catch (error) {
		logger.error("Failed to create chatRoom in DynamoDB:", toError(error));
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
		logger.info(`Successfully to add ${role}'s chatMessage in DynamoDB:`, {
			userId,
			roomId: chatMessageData.roomId,
		});
		return successResponse(chatMessageData);
	} catch (error) {
		logger.error(
			`Failed to add ${role}'s chatMessage in DynamoDB:`,
			toError(error),
		);
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};

// チャットルームのタイトルを変更
export const updateChatRoom = async (
	userId: string,
	roomId: string,
	title: string,
): Promise<ResultResponse<ChatRoomItems>> => {
	try {
		const timestamp = new Date().toISOString();

		const result = await dynamoDBDocClient.send(
			new UpdateCommand({
				TableName: process.env.CHATROOMS_TABLE_NAME,
				Key: {
					userId,
					roomId,
				},
				UpdateExpression: "set #title = :title, #updatedAt = :updatedAt",
				ExpressionAttributeNames: {
					"#title": "title",
					"#updatedAt": "updatedAt",
				},
				ExpressionAttributeValues: {
					":title": title,
					":updatedAt": timestamp,
				},
				ReturnValues: "ALL_NEW",
				ConditionExpression:
					"attribute_exists(roomId) AND attribute_exists(createdAt)",
			}),
		);
		logger.info("Successfully to update chatRoom in DynamoDB:", {
			userId,
			roomId,
			title,
		});
		return successResponse(result.Attributes as ChatRoomItems);
	} catch (error) {
		const err = toError(error);
		if (err.name === "ConditionalCheckFailedException") {
			logger.info("Not found the chatRoom for update in DynamoDB:", {
				userId,
				roomId,
				title,
			});
			return errorResponse(ERROR_CODES.CHATROOM_NOT_FOUND);
		}
		logger.error("Failed to update chatRoom in DynamoDB:", err);
		return errorResponse(ERROR_CODES.REQUEST_PROCESSING_ERROR);
	}
};
