import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v7 as uuidv7 } from "uuid";
import { ERROR_CODES } from "../constants/error";
import type { ChatMessageItems, ChatRoomItems } from "../types/chat";
import { dynamoDBDocClient } from "../utils/dynamodb";
import { toError } from "../utils/error";
import { logger } from "../utils/logger";
import { errorResponse, successResponse } from "../utils/response";

// チャットルーム新規作成
export const createChatRoom = async (userId: string) => {
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
) => {
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
