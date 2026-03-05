import Logger from "@utils/logger.ts";
import { WebSocketServer } from "ws";

class WebSocketService {
	private static instance: WebSocketService;

	private webSocket: WebSocketServer | null = null;

	private constructor(private readonly logger = Logger.getInstance()) { }

	static getInstance(): WebSocketService {
		if (!WebSocketService.instance) {
			WebSocketService.instance = new WebSocketService();
		}
		return WebSocketService.instance;
	}

	onConnection(ws: any, req: any) {
		ws.on("message", this.onMessage.bind(this));
		ws.on("error", this.onError.bind(this));
		this.logger.info(`WebSocketService.onConnection`, "core");
	}

	onMessage(data: any) {
		this.logger.info(`WebSocketService.onMessage: ${data}`, "core");
	}

	onError(error: any) {
		this.logger.info(`WebSocketService.onError: ${error}`, "core");
	}

	async init(server: any): Promise<void> {
		this.logger.info(`WebSocketService.init called with server type: ${typeof server}`, "core");

		if (!server) {
			throw new Error('Server is required for WebSocket initialization');
		}

		if (typeof server.on !== 'function') {
			this.logger.error(`Invalid server object - missing 'on' method. Server type: ${typeof server}`, "core");
			throw new Error('Invalid server object provided to WebSocketService');
		}

		this.webSocket = new WebSocketServer({
			server: server,
		});

		this.webSocket.on("connection", this.onConnection.bind(this));
		this.logger.info(`WebSocketService has started`, "core");
	}
}

export default WebSocketService;
