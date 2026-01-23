import type { ChatRoomItems } from "@/types/chat";
import { CardsSkeleton } from "../diary/DiaryCardSkeletons";
import { ChatRoomCardItems } from "./ChatRoomCardItems";

export function ChatSideMenu({
	chatRooms,
	isChatLoading,
	handleChatRoomClick,
	selectRoomId,
}: {
	chatRooms: ChatRoomItems;
	isChatLoading: boolean;
	handleChatRoomClick: (roomId: string) => Promise<void>;
	selectRoomId: string;
}) {
	return (
		<div>
			{isChatLoading ? (
				<CardsSkeleton />
			) : (
				<div className="flex flex-col gap-2">
					<ChatRoomCardItems
						chatRooms={chatRooms}
						handleChatRoomClick={handleChatRoomClick}
						selectRoomId={selectRoomId}
					/>
				</div>
			)}
		</div>
	);
}
