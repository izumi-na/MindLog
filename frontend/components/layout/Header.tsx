"use client";

import { useSignOut } from "@/hooks/useSignOut";
import { Button } from "../ui/button";

export function Header() {
	const { handleSignOut } = useSignOut();
	return (
		<div className="w-full border-b bg-white/50 px-4 py-2 drop-shadow-md">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-bold">MindLog</h1>
				<Button variant="outline" onClick={handleSignOut}>
					ログアウト
				</Button>
			</div>
		</div>
	);
}
