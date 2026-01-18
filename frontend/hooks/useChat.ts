import { useState } from "react";
import { toast } from "sonner";
import { v7 as uuidv7 } from "uuid";
import { getAuthClient } from "@/lib/api/api-client";
import type { ChatMessage } from "@/types/chat";
import type { PostChatRequest } from "../../backend/src/types/chat";

export const useChat = () => {
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);

	const sendChatMessage = async (data: PostChatRequest) => {
		setIsGenerating(true);
		try {
			setChatMessages((prev) => [
				...prev,
				{ id: uuidv7(), role: "user", content: data.message },
			]);
			const authClient = await getAuthClient();
			const res = await authClient.chat.$post({
				json: data,
			});
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
					if (prev.some((prevItem) => prevItem.id === assistantMessageId)) {
						return prev.map((prevItem) =>
							prevItem.id === assistantMessageId
								? { ...prevItem, content: prevItem.content + text }
								: prevItem,
						);
					}
					return [
						...prev,
						{
							id: assistantMessageId,
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
		}
	};

	return { sendChatMessage, chatMessages, isGenerating };
};
