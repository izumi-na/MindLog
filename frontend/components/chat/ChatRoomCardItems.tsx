import type { ChatRoomItems } from "@/types/chat";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function ChatRoomCardItems({
	chatRooms,
	handleChatRoomClick,
	selectRoomId,
}: {
	chatRooms: ChatRoomItems;
	handleChatRoomClick: (roomId: string) => Promise<void>;
	selectRoomId: string;
}) {
	return chatRooms.map((item) => (
		<Card
			key={item.roomId}
			onClick={() => handleChatRoomClick(item.roomId)}
			className={item.roomId === selectRoomId ? "bg-zinc-100" : ""}
		>
			<CardHeader>
				<CardTitle>{item.title}</CardTitle>
				<CardDescription>
					{item.updatedAt.split("T")[0].split("-").join("/")}{" "}
					{item.updatedAt.split("T")[1].split(":", 2).join(":")}
				</CardDescription>
			</CardHeader>
		</Card>
	));
}
