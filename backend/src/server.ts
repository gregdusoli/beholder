import UsersRepository from "@repositories/users-repository.ts";
import ExchangeMonitor from "@services/exchange-monitor.ts";
import logger from "@utils/logger.ts";
import type { Express } from "express";
import App from "./app.ts";
import Database from "./db.ts";
import { Sequelize } from "sequelize";

export class Server {
	private appName = process.env.APP_NAME ?? "Beholder";

	private appPort = Number(process.env.APP_PORT ?? "3001");

	constructor(
		private readonly appInstance: Express = App,
		private readonly databaseInstance: Sequelize = Database,
		private readonly usersRepository = new UsersRepository(),
		private readonly exchangeMonitor = new ExchangeMonitor()
	) {}

	private async getActiveUsers() {
		const users = await this.usersRepository.getActiveUsers();

		if (!users || !users.length) {
			return logger("warn", "No active users found. Exiting... ");
		}

		return users;
	}

	async init() {
		this.databaseInstance;

		const activeUsers: any = await this.getActiveUsers();

		await this.exchangeMonitor.init(activeUsers[0].id);

		this.appInstance.listen(this.appPort, () => {
			logger(
				"success",
				`${this.appName} server running on port ${this.appPort}`
			);
		});
	}
}

(async () => {
	const server = new Server();
	await server.init();
})();
