import type { InferResponseType } from "hono";
import { client } from "@/lib/api/api-client";

const getChatRooms = client.chat.rooms.$get;
type GetChatRoomsResponse = InferResponseType<typeof getChatRooms>;
export type ChatRoomItems = Extract<
	GetChatRoomsResponse,
	{ success: true }
>["data"];

const getChatRoomMessages = client.chat.rooms[":roomId"].messages.$get;
type GetChatRoomMessagesResponse = InferResponseType<
	typeof getChatRoomMessages
>;
export type ChatRoomMessageItems = Extract<
	GetChatRoomMessagesResponse,
	{ success: true }
>["data"][number];
