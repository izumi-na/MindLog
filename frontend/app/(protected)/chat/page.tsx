"use client";

import { useEffect, useRef } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatOutput } from "@/components/chat/ChatOutput";
import { ChatSideMenu } from "@/components/chat/ChatSideMenu";
import { useChat } from "../../../hooks/useChat";

export default function Chat() {
	const {
		sendChatMessage,
		chatMessages,
		isGenerating,
		fetchChatRooms,
		chatRooms,
		isChatLoading,
		fetchChatRoomMessages,
		selectRoomId,
		handleClearChatRoom,
	} = useChat();
	const scrollBottomRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: chatMessages が変更されたときにスクロールする必要があるため
	useEffect(() => {
		scrollBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatMessages]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
	useEffect(() => {
		fetchChatRooms();
	}, []);

	useEffect(() => {
		console.log("selectRoomId:", selectRoomId);
	}, [selectRoomId]);

	return (
		<div className="grid grid-cols-[1fr_3fr]">
			<div className="bg-stone-50 p-2">
				<ChatSideMenu
					chatRooms={chatRooms}
					isChatLoading={isChatLoading}
					handleChatRoomClick={fetchChatRoomMessages}
					selectRoomId={selectRoomId}
					handleClearChatRoom={handleClearChatRoom}
				/>
			</div>
			<div className="flex flex-col min-h-[90lvh] p-6">
				<div className="grow">
					<ChatOutput chatMessages={chatMessages} />
				</div>
				<div>
					<ChatInput
						sendChatMessage={sendChatMessage}
						isGenerating={isGenerating}
						selectRoomId={selectRoomId}
					/>
				</div>
				<div ref={scrollBottomRef} />
			</div>
		</div>
	);
}
