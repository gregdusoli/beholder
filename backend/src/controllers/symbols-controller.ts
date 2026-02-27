import SymbolsRepository from "@repositories/symbols-repository.ts";
import ExchangeService from "@services/exchange-service.ts";

class SymbolsController {
	private readonly useLeverageTokens = process.env.LEVERAGE_TOKENS === "true";

	private readonly ignoredFiat = process.env.IGNORED_FIAT
		? process.env.IGNORED_FIAT.split(",")
		: [];

	constructor(
		private readonly symbolsRepository = new SymbolsRepository(),
		private readonly exchangeService = new ExchangeService()
	) {}

	async syncSymbols() {
		const data = await this.exchangeService.exchangeInfo();

		let symbols = data.symbols.map((item: any) => {
			if (
				!this.useLeverageTokens &&
				(item.baseAsset.endsWith("UP") || item.baseAsset.endsWith("DOWN"))
			) {
				return false;
			}

			if (
				this.ignoredFiat.includes(item.quoteAsset) ||
				this.ignoredFiat.includes(item.baseAsset)
			) {
				return false;
			}

			const notionalFilter = item.filters.find(
				(f: any) => f.filterType === "NOTIONAL"
			);
			const lotSizeFilter = item.filters.find(
				(f: any) => f.filterType === "LOT_SIZE"
			);
			const priceFilter = item.filters.find(
				(f: any) => f.filterType === "PRICE_FILTER"
			);

			return {
				symbol: item.symbol,
				basePrecision: item.baseAssetPrecision,
				quotePrecision: item.quoteAssetPrecision,
				base: item.baseAsset,
				quote: item.quoteAsset,
				minNotional: notionalFilter ? notionalFilter.minNotional : "1",
				minLotSize: lotSizeFilter ? lotSizeFilter.minQty : "1",
				stepSize: lotSizeFilter ? lotSizeFilter.stepSize : "1",
				tickSize: priceFilter ? priceFilter.tickSize : "1",
			};
		});

		symbols = symbols.filter((s: any) => s);

		await this.symbolsRepository.deleteAll();
		await this.symbolsRepository.bulkInsert(symbols);

		return symbols;
	}
}

export default new SymbolsController();
