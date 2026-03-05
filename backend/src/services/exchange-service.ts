import Logger from "@utils/logger.ts";
import Binance from "node-binance-api";

export default class ExchangeService {
	private readonly exchangeApiKey = process.env.EXCHANGE_API_KEY;

	private readonly exchangeApiSecret = process.env.EXCHANGE_API_SECRET;

	protected exchange: Binance;

	constructor(private readonly logger = Logger.getInstance()) {
		this.validateCredentials();
		this.exchange = new Binance({
			APIKEY: process.env.EXCHANGE_API_KEY!,
			APISECRET: process.env.EXCHANGE_API_SECRET!,
			family: false,
			test: process.env.NODE_ENV !== "production",
			verbose: process.env.EXCHANGE_LOGS === "verbose",
		});
	}

	private validateCredentials() {
		if (!this.exchangeApiKey || !this.exchangeApiSecret) {
			throw new Error("Exchange API credentials are required. Please set EXCHANGE_API_KEY and EXCHANGE_API_SECRET environment variables.");
		}
	}

	async exchangeInfo() {
		return this.exchange.exchangeInfo();
	}

	async balance() {
		await this.exchange.useServerTime();
		return this.exchange.balance();
	}

	tickerStream(callback: Function) {
		this.exchange.websockets.prevDay(
			undefined,
			(undefined, data) => {
				const type = typeof data?.length ? "array" : "object";

				this.logger.info(
					`${data?.length || 0} received market stream tickers`,
					"core"
				);

				callback(type === "array" ? data : Object.values(data));
			},
			() => true
		);
	}
}
