export function CardSkeleton() {
	return (
		<div className="bg-card text-card-foreground flex flex-col gap-2 rounded-xl border p-6 shadow-sm animate-pulse">
			<div className="h-5 w-30 rounded-md bg-gray-200" />
			<div className="h-4 w-15 rounded-md bg-gray-200" />
			<div className="pt-4">
				<div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
					<div className="h-7 w-15 rounded-md bg-gray-200" />
					<div className="h-4 w-30 rounded-md bg-gray-200" />
				</div>
			</div>
		</div>
	);
}

export function CardsSkeleton() {
	return (
		<>
			<CardSkeleton />
			<CardSkeleton />
			<CardSkeleton />
			<CardSkeleton />
		</>
	);
}
