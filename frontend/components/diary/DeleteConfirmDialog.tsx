import type { SetStateAction } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteConfirmDialog({
	isDeleteConfirmDialog,
	setIsDeleteConfirmDialog,
	handleDelete,
}: {
	isDeleteConfirmDialog: boolean;
	setIsDeleteConfirmDialog: (value: SetStateAction<boolean>) => void;
	handleDelete: () => Promise<void>;
}) {
	return (
		<AlertDialog
			open={isDeleteConfirmDialog}
			onOpenChange={setIsDeleteConfirmDialog}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>この日記を削除しますか？</AlertDialogTitle>
					<AlertDialogDescription>
						この操作は取り消せません。
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>キャンセル</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>削除する</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
