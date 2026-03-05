import UsersRepository from "@repositories/users-repository.ts";
import ExchangeMonitor from "@services/exchange-monitor.ts";
import Logger from "@utils/logger.ts";
import Database from "./database.ts";
import HttpApi from "./http.ts";

export class Application {
	private static instance: Application;

	private constructor(
		private readonly logger = Logger.getInstance(),
		private readonly httpApi = HttpApi.getInstance(),
		private readonly database = Database.getInstance(),
		private readonly usersRepository = new UsersRepository(),
		private readonly exchangeMonitor = new ExchangeMonitor()
	) { }

	private async initializeServices(): Promise<void> {
		await this.database.init();

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
		await this.httpApi.init();

		this.logger.info("Application server successfully started", "core");
	}
}

export default Application;
