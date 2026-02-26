import Binance from "node-binance-api";

export class ExchangeService {
	protected exchange: Binance;

	constructor() {
		this.validateCredentials();
		this.exchange = new Binance({
			APIKEY: process.env.EXCHANGE_API_KEY!,
			APISECRET: process.env.EXCHANGE_API_SECRET!,
			family: false,
			test: process.env.NODE_ENV !== "production",
			verbose: process.env.EXCHANGE_LOGS === "true",
		});
	}

	private validateCredentials() {
		if (!process.env.EXCHANGE_API_KEY || !process.env.EXCHANGE_API_SECRET) {
			throw new Error("Missing Exchange API credentials");
		}
	}

	async exchangeInfo() {
		return this.exchange.exchangeInfo();
	}

	async balance() {
		await this.exchange.useServerTime();
		return this.exchange.balance();
	}
}
