import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/types/chat";
import { Card, CardContent } from "../ui/card";

export function ChatOutput({ chatMessages }: { chatMessages: ChatMessage[] }) {
	return chatMessages.map((chatMessage) =>
		chatMessage.role === "user" ? (
			<div key={chatMessage.id} className="flex justify-end">
				<Card>
					<CardContent>{chatMessage.content}</CardContent>
				</Card>
			</div>
		) : (
			<div
				key={chatMessage.id}
				className="prose prose-p:m-0 prose-ul:m-0 prose-ol:my-2 prose-li:m-0.5 p-6"
			>
				<ReactMarkdown remarkPlugins={[remarkGfm]}>
					{chatMessage.content}
				</ReactMarkdown>
			</div>
		),
	);
}
