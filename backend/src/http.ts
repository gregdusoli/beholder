import errorMiddleware from "@middlewares/error-middleware";
import Logger from "@utils/logger";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { type Express } from "express";
import helmet from "helmet";
import * as http from "http";
import morgan from "morgan";
import router from "./router";

dotenv.config();

export class HttpServer {
	private static instance: HttpServer;

	private readonly express: Express;

	private readonly port: number;

	private constructor(
		private readonly logger = Logger.getInstance(),
	) {
		this.express = express();
		this.setupMiddleware();
		this.port = Number(process.env.APP_PORT ?? "3001");
	}

	private setupMiddleware(): void {
		this.express.use(helmet());
		this.express.use(express.json());
		this.express.use(
			cors({
				origin: process.env.CORS_ORIGIN,
			})
		);
		this.express.use(
			morgan("dev", {
				immediate: false,
				stream: {
					write: (message) => {
						this.logger.info(`\n${message.trim()}`, "application");
					},
				},
			})
		);
		this.express.use(router);
		this.express.use(errorMiddleware);
	}


	async init(): Promise<http.Server> {
		const server: http.Server = http.createServer(this.express);

		server.listen(this.port, () => {
			this.logger.info(
				`Application server running on port ${this.port}`,
				"core"
			);
		});

		this.logger.info("HTTP server initialized", "core");
		return server;
	}


	static getInstance(): HttpServer {
		if (!HttpServer.instance) {
			HttpServer.instance = new HttpServer();
		}
		return HttpServer.instance;
	}
}

export default HttpServer;
