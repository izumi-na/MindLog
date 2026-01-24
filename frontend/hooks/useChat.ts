import { AuthError } from "aws-amplify/auth";
import { useState } from "react";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";
import { getAuthClient } from "@/lib/api/api-client";
import type { ChatRoomItems, ChatRoomMessageItems } from "@/types/chat";
import type { PostChatRequest } from "../../backend/src/types/chat";
import { useSignOut } from "./useSignOut";

export const useChat = () => {
	const { handleSignOut } = useSignOut();
	const [chatMessages, setChatMessages] = useState<ChatRoomMessageItems[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [chatRooms, setChatRooms] = useState<ChatRoomItems>([]);
	const [isChatLoading, setIsChatLoading] = useState(false);
	const [selectRoomId, setSelectRoomId] = useState("");

	// チャットメッセージ送信時
	const sendChatMessage = async (data: PostChatRequest, roomId: string) => {
		setIsGenerating(true);
		try {
			setChatMessages((prev) => [
				...prev,
				{
					roomId,
					createdAt: new Date().toISOString(),
					userId: "",
					chatMessageId: uuidv7(),
					role: "user",
					content: data.message,
				},
			]);
			const authClient = await getAuthClient();
			// roomIdが""の時はチャットルーム新規作成、それ以外は既存チャットルームにメッセージ追加
			const res =
				roomId === ""
					? await authClient.chat.rooms.$post({
							json: data,
						})
					: await authClient.chat.rooms[":roomId"].$post({
							json: data,
							param: {
								roomId,
							},
						});
			const newRoomId = res.headers.get("X-Room-Id");
			if (newRoomId) {
				roomId = newRoomId;
				setSelectRoomId(newRoomId);
				setChatMessages((prev) =>
					prev.map((item) =>
						item.roomId === "" ? { ...item, roomId: newRoomId } : item,
					),
				);
			}
			const reader = res.body?.getReader();
			if (!reader) return;
			const decoder = new TextDecoder();
			const assistantMessageId = uuidv7();
			while (true) {
				// レスポンスのストリーミングを読み込む
				const { done, value } = await reader.read();
				if (done) {
					return;
				}
				if (!value) continue;
				const text = decoder.decode(value);
				setChatMessages((prev) => {
					if (
						prev.some(
							(prevItem) => prevItem.chatMessageId === assistantMessageId,
						)
					) {
						return prev.map((prevItem) =>
							prevItem.chatMessageId === assistantMessageId
								? { ...prevItem, content: prevItem.content + text }
								: prevItem,
						);
					}
					return [
						...prev,
						{
							roomId,
							createdAt: new Date().toISOString(),
							userId: "",
							chatMessageId: assistantMessageId,
							role: "assistant",
							content: text,
						},
					];
				});
			}
		} catch (error) {
			console.error("error:", error);
			toast.error("レスポンスの生成に失敗しました。再度実行してください。");
		} finally {
			setIsGenerating(false);
			await fetchChatRoomMessages(roomId);
			await fetchChatRooms();
		}
	};

	// サイドメニューに表示するチャットルーム一覧を取得
	const fetchChatRooms = async () => {
		setIsChatLoading(true);
		try {
			const authClient = await getAuthClient();
			const res = await authClient.chat.rooms.$get();
			if (!res.ok) {
				throw new Error("Failed to Fetch ChatRoomsData");
			}
			const result = await res.json();
			if (!result) {
				throw new Error("Failed to Parse ChatRoomsData");
			}
			if (result.success) {
				setChatRooms(result.data);
			}
		} catch (error) {
			if (error instanceof AuthError) {
				toast.error("認証エラーが発生しました。再度ログインしてください。");
				await handleSignOut();
				return;
			}
			toast.error("データの取得に失敗しました。画面をリロードしてください。");
		} finally {
			setIsChatLoading(false);
		}
	};

	// チャットルームのメッセージ一覧を取得
	const fetchChatRoomMessages = async (roomId: string) => {
		setSelectRoomId(roomId);
		try {
			const authClient = await getAuthClient();
			const res = await authClient.chat.rooms[":roomId"].messages.$get({
				param: {
					roomId,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to Fetch ChatRoomMessages");
			}
			const result = await res.json();
			if (!result) {
				throw new Error("Failed to Parse ChatRoomMessages");
			}
			if (result.success) {
				setChatMessages(result.data);
			}
		} catch (error) {
			if (error instanceof AuthError) {
				toast.error("認証エラーが発生しました。再度ログインしてください。");
				await handleSignOut();
				return;
			}
			toast.error("データの取得に失敗しました。画面をリロードしてください。");
		}
	};

	// チャットルームをクリアにする
	const handleClearChatRoom = () => {
		setSelectRoomId("");
		setChatMessages([]);
	};

	return {
		sendChatMessage,
		chatMessages,
		isGenerating,
		fetchChatRooms,
		chatRooms,
		isChatLoading,
		fetchChatRoomMessages,
		selectRoomId,
		handleClearChatRoom,
	};
};
