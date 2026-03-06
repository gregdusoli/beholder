import type { MarketProps } from "@interfaces/market";
import Logger from "@utils/logger";
import Beholder from "../beholder";
import WebsocketServer from "../websocket";
import ExchangeService from "./exchange-service";

class MarketMonitorService {
	constructor(
		private readonly logger = Logger.getInstance(),
		private readonly beholder = Beholder.getInstance(),
		private readonly exchangeService = new ExchangeService(),
		private readonly websocketService = WebsocketServer.getInstance(),
	) { }

	startTickerMonitor() {
		this.exchangeService.tickerStream(async (markets: MarketProps[]) => {
			if (!markets || !markets.length) return;

			const promises = markets.map((market: MarketProps) =>
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

export default MarketMonitorService;
