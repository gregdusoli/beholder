import symbolsRepository from "@repositories/symbols-repository.ts";
import { ExchangeService } from "@services/exchange-service.ts";

async function syncSymbols() {
	const useLeverageTokens = process.env.LEVERAGE_TOKENS === "true";
	const ignoredFiat = process.env.IGNORED_FIAT
		? process.env.IGNORED_FIAT.split(",")
		: [];

	const exchange = new ExchangeService();
	const data = await exchange.exchangeInfo();

	let symbols = data.symbols.map((item: any) => {
		if (
			!useLeverageTokens &&
			(item.baseAsset.endsWith("UP") || item.baseAsset.endsWith("DOWN"))
		) {
			return false;
		}

		if (
			ignoredFiat.includes(item.quoteAsset) ||
			ignoredFiat.includes(item.baseAsset)
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

	await symbolsRepository.deleteAll();
	await symbolsRepository.bulkInsert(symbols);

	return symbols;
}

export default { syncSymbols };
