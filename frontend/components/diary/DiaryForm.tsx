import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { feelingMap } from "@/constants/diary";
import { useSignOut } from "@/hooks/useSignOut";
import { getAuthClient } from "@/lib/api/api-client";
import { AuthError } from "@/lib/errors";
import type { CreateDiaryRequest } from "@/types/diary";
import { CreateDiaryRequestSchema } from "../../../backend/src/validators/diary";
import { Button } from "../ui/button";

export function DiaryForm() {
	const router = useRouter();
	const { handleSignOut } = useSignOut();

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<CreateDiaryRequest>({
		resolver: zodResolver(CreateDiaryRequestSchema),
		defaultValues: {
			date: new Date().toISOString().split("T")[0],
		},
	});

	const onSubmit = async (data: CreateDiaryRequest) => {
		try {
			const authClient = await getAuthClient();
			const res = await authClient.diaries.$post({
				json: data,
			});
			if (!res.ok) {
				toast.error("日記の登録に失敗しました。再度実行してください。");
				return;
			}
			toast.success("日記の登録が完了しました。");
			reset();
			router.push("/");
		} catch (error) {
			if (error instanceof AuthError) {
				toast.error("認証エラーが発生しました。再度ログインしてください。");
				await handleSignOut();
				return;
			}
			toast.error("日記の登録に失敗しました。再度実行してください。");
		}
	};

	return (
		<div className="w-full p-6">
			<Card className="w-full p-4">
				<form onSubmit={handleSubmit(onSubmit)}>
					<CardHeader>
						<CardTitle>日々を綴る</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-6 my-6">
							<div className="flex flex-col gap-2">
								<Label htmlFor="date">日付</Label>
								<Input type="date" id="date" required {...register("date")} />
								{errors.date && (
									<p className="text-sm text-destructive">
										{errors.date.message}
									</p>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="title">タイトル</Label>
								<Input id="title" {...register("title")} />
								{errors.title && (
									<p className="text-sm text-destructive">
										{errors.title.message}
									</p>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="feeling">今日の気分</Label>
								<Controller
									name="feeling"
									control={control}
									render={({ field }) => (
										<div className="flex gap-2 flex-wrap">
											{feelingMap.map((feelingItem) => (
												<Button
													type="button"
													key={feelingItem.value}
													variant={
														feelingItem.value === field.value
															? "default"
															: "outline"
													}
													onClick={() => field.onChange(feelingItem.value)}
												>
													{feelingItem.label}
													{feelingItem.icon}
												</Button>
											))}
										</div>
									)}
								/>
								{errors.feeling && (
									<p className="text-sm text-destructive">
										{errors.feeling.message}
									</p>
								)}
							</div>
							<div className="flex flex-col gap-2">
								<Label htmlFor="content">日記</Label>
								<Textarea id="content" required {...register("content")} />
								{errors.content && (
									<p className="text-sm text-destructive">
										{errors.content.message}
									</p>
								)}
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button type="submit" className="w-full">
							記録する
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
