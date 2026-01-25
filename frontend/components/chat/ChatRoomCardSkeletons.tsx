export function ChatRoomCardSkeleton() {
	return (
		<div className="bg-card text-card-foreground flex flex-col gap-2 rounded-xl border p-4 shadow-sm animate-pulse">
			<div className="h-8 w-full rounded-md bg-gray-200" />
			<div className="h-4 w-full rounded-md bg-gray-200" />
		</div>
	);
}

export function ChatRoomCardSkeletons() {
	return (
		<>
			<ChatRoomCardSkeleton />
			<ChatRoomCardSkeleton />
			<ChatRoomCardSkeleton />
			<ChatRoomCardSkeleton />
		</>
	);
}
