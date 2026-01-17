import { Hono } from "hono";
import { cors } from "hono/cors";
import { diaryRoute } from "./routes/diaryRoute";

const app = new Hono()
	.use(
		"*",
		cors({
			origin: "http://localhost:3000",
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		}),
	)
	.route("/diaries", diaryRoute);

export default app;

export type AppType = typeof app;
