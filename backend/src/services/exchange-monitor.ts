import logger from "@utils/logger.ts";
import Beholder from "../beholder.ts";
import ExchangeService from "./exchange-service.ts";
import { Market } from "./exchange-interface.ts";

export default class ExchangeMonitor {
	constructor(
		private readonly beholder = Beholder.getInstance(),
		private readonly exchangeService = new ExchangeService()
	) {}

	starTickerMonitor() {
		logger("info", "Exchange Monitor: Ticker monitor loaded");

		this.exchangeService.tickerStream(async (markets: Market[]) => {
			if (!markets || !markets.length) return;

			const promises = markets.map((market: Market) =>
				this.beholder.updateMemory({
					index: "TICKER",
					symbol: market.symbol,
					value: market,
				})
			);

			await Promise.all(promises);
		});
	}

	async init(userId: string) {
		this.starTickerMonitor();

		logger("info", "Exchange Monitor successfully initialized");
	}
}
