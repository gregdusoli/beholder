import type { MarketProps } from "@interfaces/market";
import SymbolsRepository from "@repositories/symbols-repository";
import { getErrorMessage } from "@utils/error";
import Logger from "@utils/logger";
import Beholder from "../beholder";
import WebsocketServer from "../websocket";
import ExchangeService from "./exchange-service";

class MarketMonitorService {
	private symbolsMap: Map<string, boolean> = new Map();

	constructor(
		private readonly logger = Logger.getInstance(),
		private readonly beholder = Beholder.getInstance(),
		private readonly symbolsRepository = new SymbolsRepository(),
		private readonly exchangeService = new ExchangeService(),
		private readonly websocketService = WebsocketServer.getInstance()
	) {}

	private async loadWallet(userId: string, canRunAutomations = true) {
		const balance: any = await this.exchangeService.balance();

		const wallet = await Promise.all(
			Object.keys(balance).map(async (item: any) => {
				if (canRunAutomations) {
					const memory = await this.beholder.getMemory(
						item,
						`WALLET_${userId}`
					);

					if (memory === balance[item].available) return;
				}

				this.beholder.updateMemory({
					index: `WALLET_${userId}}`,
					symbol: item,
					value: balance[item].available,
					canRunAutomations,
				});

				const message = `Updated user's wallet item ${item}`;
				this.websocketService.broadcast({
					notification: { type: "success", text: message },
				});

				return {
					symbol: item,
					available: balance[item].available,
					onOrder: balance[item].onOrder,
				};
			})
		);

		return wallet;
	}

	private async startTickerMonitor() {
		const symbols = await this.symbolsRepository.getSymbols();
		if (symbols?.length) {
			symbols.map((item) => this.symbolsMap.set(item.symbol, true));
		}

		this.exchangeService.tickerStream(async (markets: MarketProps[]) => {
			if (!markets || !markets.length) return;

			let results = await Promise.all(
				markets.map((market: MarketProps) => {
					if (!this.symbolsMap.has(market.symbol)) return false;

					return this.beholder.updateMemory({
						index: "TICKER",
						symbol: market.symbol,
						value: market,
					});
				})
			);

			if (!results) return;
			results = results.filter((item) => item);

			if (results?.length) {
				results.map((res: any) =>
					this.websocketService.broadcast({
						notification: {
							type: "success",
							text: `Updated ticker ${res.symbol}`,
						},
					})
				);
			}
		});
	}

	private processBalanceData(userId: string, data: any) {
		this.loadWallet(userId).catch((err) =>
			this.logger.error(
				`U-${userId}: Wallet not loaded: ${getErrorMessage(err)}`,
				"core"
			)
		);

		this.logger.info(`U-${userId}: ${JSON.stringify(data)}`, "core");
	}

	private processOrderData(userId: string, data: any) {
		if (data.x === "NEW") return;

		const order = {
			symbol: data.s,
			orderId: data.i,
			side: data.S,
			type: data.o,
			status: data.X,
			transactionTime: data.T,
		};

		if (data.status === "FILLED") {
			const quoteAmount = parseFloat(data.Z);
			const isQuoteComission = data?.N && order.symbol.endsWith(data.N);

			Object.assign(order, {
				avgPrice: quoteAmount / parseFloat(data.z),
				comission: data.n,
				quantity: data.q,
				net: isQuoteComission ? quoteAmount - parseFloat(data.n) : quoteAmount,
			});
		}

		if (order.status === "REJECTED") {
			Object.assign(order, { obs: data.r });
		}

		// Order update...

		this.logger.info(`U-${userId}: ${JSON.stringify(data)}`, "core");
	}

	private startUserDataMonitor(userId: string) {
		try {
			this.loadWallet(userId, false).catch((err) =>
				this.logger.error(
					`U-${userId}: Error loading user's wallet: ${getErrorMessage(err)}`,
					"core"
				)
			);

			this.exchangeService.userDataStream(
				(args: any) => this.processBalanceData(args, userId),
				(args: any) => this.processOrderData(args, userId)
			);
		} catch (error) {
			this.logger.error(
				`U-${userId}: Error starting userDataStream: ${getErrorMessage(error)}`,
				"core"
			);
		}
	}

	async init(userId: string) {
		this.startTickerMonitor();
		this.startUserDataMonitor(userId);
	}
}

export default MarketMonitorService;
