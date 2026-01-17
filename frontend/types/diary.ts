import type { InferRequestType, InferResponseType } from "hono/client";
import { client } from "@/lib/api/api-client";

const getDiary = client.diaries[":diaryId"].$get;
type GetDiaryResponse = InferResponseType<typeof getDiary>;
export type DiaryItems = Extract<GetDiaryResponse, { success: true }>["data"];

const createDiary = client.diaries.$post;
export type CreateDiaryRequest = InferRequestType<typeof createDiary>["json"];
