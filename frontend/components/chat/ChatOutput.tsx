import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatRoomMessageItems } from "@/types/chat";
import { Card, CardContent } from "../ui/card";

export function ChatOutput({
	chatMessages,
}: {
	chatMessages: ChatRoomMessageItems[];
}) {
	return chatMessages.map((chatRoomMessage) =>
		chatRoomMessage.role === "user" ? (
			<div key={chatRoomMessage.chatMessageId} className="flex justify-end">
				<Card>
					<CardContent>{chatRoomMessage.content}</CardContent>
				</Card>
			</div>
		) : (
			<div
				key={chatRoomMessage.chatMessageId}
				className="prose prose-p:m-0 prose-ul:m-0 prose-ol:my-2 prose-li:m-0.5 p-6"
			>
				<ReactMarkdown remarkPlugins={[remarkGfm]}>
					{chatRoomMessage.content}
				</ReactMarkdown>
			</div>
		),
	);
}
