"use client";

import { useEffect, useRef } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatOutput } from "@/components/chat/ChatOutput";
import { useChat } from "../../../hooks/useChat";

export default function Chat() {
	const { sendChatMessage, chatMessages, isGenerating } = useChat();
	const scrollBottomRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: chatMessages が変更されたときにスクロールする必要があるため
	useEffect(() => {
		scrollBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages]);

	return (
		<div className="flex flex-col min-h-[90lvh] p-6">
			<div className="grow">
				<ChatOutput chatMessages={chatMessages} />
			</div>
			<div>
				<ChatInput
					sendChatMessage={sendChatMessage}
					isGenerating={isGenerating}
				/>
			</div>
			<div ref={scrollBottomRef} />
		</div>
	);
}
