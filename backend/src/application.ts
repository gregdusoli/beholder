import errorMiddleware from "@middlewares/error-middleware.ts";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./router.ts";
import logger from "@utils/logger.ts";

dotenv.config();
const application = express();

application.use(helmet());
application.use(express.json());
application.use(
	cors({
		origin: process.env.CORS_ORIGIN,
	})
);
application.use(
	morgan("dev", {
		immediate: false,
		stream: {
			write: (message) => {
				logger("info", `\n${message.trim()}`);
			},
		},
	})
);
application.use(router);
application.use(errorMiddleware);

export default application;
