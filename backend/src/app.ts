import errorMiddleware from "@middlewares/error-middleware.ts";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./router.ts";

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
	})
);
app.use(
	morgan("dev", {
		immediate: false,
		stream: {
			write: (message) => {
				console.log(`\n${message.trim()}`);
			},
		},
	})
);
app.use(router);
app.use(errorMiddleware);

export default app;
