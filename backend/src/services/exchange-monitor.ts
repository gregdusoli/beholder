import Beholder from "../beholder.ts";
import ExchangeService from "./exchange-service.ts";
import { Market } from "./exchange-interface.ts";
import Logger from "@utils/logger.ts";

class ExchangeMonitor {
	constructor(
		private readonly logger = Logger.getInstance(),
		private readonly beholder = Beholder.getInstance(),
		private readonly exchangeService = new ExchangeService()
	) { }

	startTickerMonitor() {
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
			this.logger.info(`Updated ${markets.length} tickers in memory`, "exchange");
		});
	}

	async init(userId: string) {
		this.startTickerMonitor();
		this.logger.info(`Exchange Monitor initialized for user: ${userId}`, "core");
	}
}

export default ExchangeMonitor;
