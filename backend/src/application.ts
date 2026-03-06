import UsersRepository from "@repositories/users-repository";
import MarketMonitorService from "@services/exchange-monitor";
import Logger from "@utils/logger";
import Database from "./database";
import HttpServer from "./http";
import WebsocketServer from "./websocket";

export class Application {
	private static instance: Application;

	private constructor(
		private readonly logger = Logger.getInstance(),
		private readonly httpApi = HttpServer.getInstance(),
		private readonly database = Database.getInstance(),
		private readonly websocketServer = WebsocketServer.getInstance(),
		private readonly usersRepository = new UsersRepository(),
		private readonly exchangeMonitor = new MarketMonitorService()
	) { }

	private async initializeServices(): Promise<void> {
		await this.database.init();
		const httpServer = await this.httpApi.init();
		await this.websocketServer.init(httpServer);

		const activeUsers: any = await this.usersRepository.getActiveUsers();
		if (activeUsers) {
			await this.exchangeMonitor.init(activeUsers[0].id);
		}
	}

	static getInstance(): Application {
		if (!Application.instance) {
			Application.instance = new Application();
		}
		return Application.instance;
	}

	async start(): Promise<void> {
		await this.initializeServices();
		this.logger.info("Application server successfully started", "core");
	}
}

export default Application;
