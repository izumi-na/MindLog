import type z from "zod";
import type { PostChatRequestSchema } from "../validators/chat";

export type PostChatRequest = z.infer<typeof PostChatRequestSchema>;
