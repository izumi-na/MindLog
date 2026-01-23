import type z from "zod";
import type { PostChatRequestSchema } from "../validators/chat";

export type PostChatRequest = z.infer<typeof PostChatRequestSchema>;

// ChatRoomsテーブルのスキーマ
export type ChatRoomItems = {
	userId: string;
	roomId: string;
	title: string;
	createdAt: string;
	updatedAt: string;
};

// ChatMessagesテーブルのスキーマ
export type ChatMessageItems = {
	roomId: string;
	createdAt: string;
	userId: string;
	chatMessageId: string;
	role: "user" | "assistant";
	content: string;
};
