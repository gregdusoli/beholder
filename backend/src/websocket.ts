import type { HttpServer } from "@interfaces/http-server";
import Logger from "@utils/logger";
import { WebSocketServer as Websocket, WebSocket } from "ws";

class WebsocketServer {
	private static instance: WebsocketServer;

	private webSocket: Websocket | null = null;

	private httpServer: HttpServer | undefined;

	constructor(
		private readonly logger = Logger.getInstance()
	) { }

	static getInstance(): WebsocketServer {
		if (!WebsocketServer.instance) {
			WebsocketServer.instance = new WebsocketServer();
		}
		return WebsocketServer.instance;
	}

	onConnection(ws: WebSocket, req: any) {
		ws.on("message", this.onMessage.bind(this));
		ws.on("error", this.onError.bind(this));
		this.logger.info(`WebSocketService.onConnection`, "core");
	}

	onMessage(data: WebSocket.RawData) {
		this.logger.info(`WebSocketService.onMessage: ${data}`, "core");
	}

	onError(error: Error) {
		this.logger.info(`WebSocketService.onError: ${error}`, "core");
	}

	async init(httpServer: HttpServer): Promise<void> {
		this.httpServer = httpServer;

		if (!this.httpServer) {
			throw new Error('Server is required for WebSocket initialization');
		}

		this.webSocket = new Websocket({
			server: this.httpServer as any,
		});

		this.webSocket.on("connection", this.onConnection.bind(this));
		this.logger.info(`WebSocketService has started`, "core");
	}
}

export default WebsocketServer;
