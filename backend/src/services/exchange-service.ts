import Binance from "node-binance-api";

export class ExchangeService {
	protected exchange: Binance;

	constructor() {
		this.exchange = new Binance({
			family: false,
			test: process.env.NODE_ENV !== "production",
			verbose: process.env.EXCHANGE_LOGS === "true",
		});
	}

	async exchangeInfo() {
		return this.exchange.exchangeInfo();
	}
}
