import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useSignOut } from "@/hooks/useSignOut";
import { getAuthClient } from "@/lib/api/api-client";
import { AuthError } from "@/lib/errors";
import type { DiaryItems } from "@/types/diary";

export const useDiaries = () => {
	const { handleSignOut } = useSignOut();
	const [diaryData, setDiaryData] = useState<DiaryItems[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleteConfirmDialog, setIsDeleteConfirmDialog] = useState(false);
	const [deleteItem, setDeleteItem] = useState<DiaryItems | null>(null);

	const fetchDiaries = useCallback(async () => {
		setIsLoading(true);
		try {
			const authClient = await getAuthClient();
			const res = await authClient.diaries.$get();
			if (!res.ok) {
				throw new Error("Failed to Fetch DiaryData");
			}
			const result = await res.json();
			if (!result) {
				throw new Error("Failed to Parse DiaryData");
			}
			if (result.success) {
				setDiaryData(result.data);
			}
		} catch (error) {
			if (error instanceof AuthError) {
				toast.error("認証エラーが発生しました。再度ログインしてください。");
				await handleSignOut();
				return;
			}
			toast.error("データの取得に失敗しました。画面をリロードしてください。");
		} finally {
			setIsLoading(false);
		}
	}, [handleSignOut]);

	const handleDeleteClick = async (item: DiaryItems) => {
		setDeleteItem(item);
		setIsDeleteConfirmDialog(true);
	};

	const handleDelete = async () => {
		try {
			if (!deleteItem) {
				throw new Error("Nothing Delete Item");
			}
			const authClient = await getAuthClient();
			const res = await authClient.diaries[":diaryId"].$delete({
				param: {
					diaryId: deleteItem.diaryId,
				},
			});
			if (!res.ok) {
				throw new Error("Failed to Delete DiaryData");
			}
			setDeleteItem(null);
			setIsDeleteConfirmDialog(false);
			toast.success("日記を削除しました");
			fetchDiaries();
		} catch (error) {
			if (error instanceof AuthError) {
				toast.error("認証エラーが発生しました。再度ログインしてください。");
				await handleSignOut();
				return;
			}
			toast.error("日記の削除に失敗しました。再度実行してください。");
		}
	};
	return {
		diaryData,
		fetchDiaries,
		isLoading,
		handleDelete,
		handleDeleteClick,
		isDeleteConfirmDialog,
		setIsDeleteConfirmDialog,
	};
};
