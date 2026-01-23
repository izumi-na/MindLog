import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import type { PostChatRequest } from "../../../backend/src/types/chat";
import { PostChatRequestSchema } from "../../../backend/src/validators/chat";
import { Button } from "../ui/button";

export const ChatInput = ({
	sendChatMessage,
	isGenerating,
	selectRoomId,
}: {
	sendChatMessage: (data: PostChatRequest, roomId: string) => Promise<void>;
	isGenerating: boolean;
	selectRoomId: string;
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PostChatRequest>({
		resolver: zodResolver(PostChatRequestSchema),
	});

	const onSubmit = async (data: PostChatRequest) => {
		await sendChatMessage(data, selectRoomId);
		reset();
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="flex gap-6 items-center">
					<Textarea
						id="message"
						{...register("message")}
						placeholder="お話ししましょう"
					/>
					{errors.message && (
						<p className="text-sm text-destructive">{errors.message.message}</p>
					)}
					<Button disabled={isGenerating}>送信</Button>
				</div>
			</form>
		</div>
	);
};
