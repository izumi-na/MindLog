import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="max-w-6xl mx-auto p-8">
			<Button variant="outline" asChild>
				<Link href={`/diaries/new`}>
					<p>＋日記登録</p>
				</Link>
			</Button>
		</div>
	);
}
