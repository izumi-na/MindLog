import { Hono } from "hono";
import { diaryRoute } from "./routes/diaryRoute";

const app = new Hono();

app.route("/diaries", diaryRoute);

export default app;
