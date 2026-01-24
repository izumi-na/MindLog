import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export const NewChat = ({
	handleClearChatRoom,
}: {
	handleClearChatRoom: () => void;
}) => {
	return (
		<div>
			<Button variant="outline" onClick={() => handleClearChatRoom()}>
				<Plus /> 新しいチャット
			</Button>
		</div>
	);
};
