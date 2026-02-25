import cors from "cors";
import * as dotenv from "dotenv";
import type { Request, Response } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
	})
);

app.use("/health", (req: Request, res: Response) => {
	res.status(200).send("Service is healthy");
});

app.use("/login", (req: Request, res: Response) => {
	res.send("Login");
});

export default app;
