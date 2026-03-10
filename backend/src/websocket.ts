import { AuthController } from "@controllers/auth-controller";
import type { HttpServer } from "@interfaces/http-server";
import Logger from "@utils/logger";
import { validateCorsOrigin } from "@utils/tools";
import jwt from "jsonwebtoken";
import { WebSocketServer as Websocket, WebSocket } from "ws";

class WebsocketServer {
	private static instance: WebsocketServer;

	private webSocket: Websocket | null = null;

	private httpServer: HttpServer | undefined;

	constructor(
		private readonly logger = Logger.getInstance()
	) {
		this.verifyClient = this.verifyClient.bind(this);
	}

	static getInstance(): WebsocketServer {
		if (!WebsocketServer.instance) {
			WebsocketServer.instance = new WebsocketServer();
		}
		return WebsocketServer.instance;
	}

	private async verifyClient(info: any, callback: (res: boolean, code?: number) => void) {
		if (!validateCorsOrigin(info.origin)) return callback(false, 403);

		const token = info.req?.url.split('token=')[1];


		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET!);

				if (decoded) {
					const isBlacklisted = AuthController.isBlacklisted(token);
					if (!isBlacklisted) return callback(true);
				}
			} catch (error) {
				this.logger.error(`Invalid token: ${error}`, "application");
			}
		}

		this.logger.info(`WebSocketService.verifyClient: ${true}`, "application");
		return callback(false, 401);
	}

	onConnection(ws: WebSocket) {
		ws.on("message", this.onMessage.bind(this));
		ws.on("error", this.onError.bind(this));
		this.logger.info(`WebSocketService.onConnection`, "application");
	}

	onMessage(data: WebSocket.RawData) {
		this.logger.info(`WebSocketService.onMessage: ${data}`, "application");
	}

	onError(error: Error) {
		this.logger.info(`WebSocketService.onError: ${error}`, "application");
	}

	broadcast(message: any) {
		this.webSocket?.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(typeof message === 'string'
					? message
					: JSON.stringify(message)
				);
			}
		});

		this.logger.info(`WebSocketService.broadcast: ${JSON.stringify(message, null, 2)}`, "application");
	}

	async init(httpServer: HttpServer): Promise<void> {
		this.httpServer = httpServer;

		if (!this.httpServer) {
			throw new Error('Server is required for WebSocket initialization');
		}

		this.webSocket = new Websocket({
			server: this.httpServer as any,
			verifyClient: this.verifyClient
		});

		this.webSocket.on("connection", this.onConnection.bind(this));
		this.logger.info(`WebSocketService has started`, "core");
	}
}

export default WebsocketServer;
