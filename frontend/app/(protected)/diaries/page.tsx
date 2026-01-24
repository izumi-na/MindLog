"use client";

import Link from "next/link";
import { useEffect } from "react";
import { DeleteConfirmDialog } from "@/components/diary/DeleteConfirmDialog";
import { CardItems } from "@/components/diary/DiaryCardItems";
import { CardsSkeleton } from "@/components/diary/DiaryCardSkeletons";
import { Button } from "@/components/ui/button";
import { useDiaries } from "@/hooks/useDiaries";

export default function DiaryHome() {
	const {
		diaryData,
		fetchDiaries,
		isLoading,
		handleDeleteClick,
		handleDelete,
		isDeleteConfirmDialog,
		setIsDeleteConfirmDialog,
	} = useDiaries();

	// biome-ignore lint/correctness/useExhaustiveDependencies: 初回マウント時のみ実行
	useEffect(() => {
		fetchDiaries();
	}, []);

	return (
		<div className="max-w-6xl mx-auto p-8">
			<div className="flex justify-end mb-4">
				<Button variant="outline" asChild>
					<Link href={`/diaries/new`}>＋日記登録</Link>
				</Button>
			</div>

			<div className="grid gap-4">
				{isLoading ? (
					<CardsSkeleton />
				) : diaryData.length === 0 ? (
					<div>
						<p>まだ日記がありません</p>
						<p>日記を登録して開始しましょう</p>
					</div>
				) : (
					<CardItems
						diaryData={diaryData}
						handleDeleteClick={handleDeleteClick}
					/>
				)}
			</div>

			<DeleteConfirmDialog
				isDeleteConfirmDialog={isDeleteConfirmDialog}
				setIsDeleteConfirmDialog={setIsDeleteConfirmDialog}
				handleDelete={handleDelete}
			/>
		</div>
	);
}
