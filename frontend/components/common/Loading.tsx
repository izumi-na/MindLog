import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
export function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<Item variant="muted">
				<ItemMedia>
					<Spinner />
				</ItemMedia>
				<ItemContent>
					<ItemTitle>ローディング...</ItemTitle>
				</ItemContent>
			</Item>
		</div>
	);
}
