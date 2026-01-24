import type { ChatRoomItems } from "@/types/chat";
import { CardsSkeleton } from "../diary/DiaryCardSkeletons";
import { ChatRoomCardItems } from "./ChatRoomCardItems";
import { NewChat } from "./NewChat";

export function ChatSideMenu({
	chatRooms,
	isChatLoading,
	handleChatRoomClick,
	selectRoomId,
	handleClearChatRoom,
}: {
	chatRooms: ChatRoomItems;
	isChatLoading: boolean;
	handleChatRoomClick: (roomId: string) => Promise<void>;
	selectRoomId: string;
	handleClearChatRoom: () => void;
}) {
	return (
		<div className="flex flex-col gap-4">
			<NewChat handleClearChatRoom={handleClearChatRoom} />
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
