import type { BeholderProps, ConversionProps } from "@interfaces/beholder";
import { Cache } from "@utils/cache";
import Logger from "@utils/logger";
import { isEmpty } from "@utils/type-utils";
import { DOLLAR_COINS, FIAT_COINS } from "./config/constants";

class Beholder extends Cache {
	static instance: Beholder;

	constructor(private readonly logger = Logger.getInstance()) {
		super();
	}

	private buildMemoryKey(
		symbol: string,
		index: string,
		interval?: string | number | null
	) {
		const indexKey = interval ? `${index}_${interval}` : index;
		return `${symbol}:${indexKey}`;
	}

	async setCache(props: BeholderProps) {
		const memoryKey = this.buildMemoryKey(props.symbol, props.index);

		this.set({ [memoryKey]: props.value });
		this.logger.info(`Cache memory updated: ${memoryKey}}`, "core");
	}

	async getMemory(
		symbolOrKey: string,
		index?: string,
		interval?: string | number
	) {
		if (symbolOrKey && index) {
			const memoryKey = this.buildMemoryKey(symbolOrKey, index, interval);
			return this.get(memoryKey);
		} else if (symbolOrKey) {
			return this.get(symbolOrKey);
		}
		return this.search();
	}

	async updateMemory(props: BeholderProps) {
		const payload = { ...props, canRunAutomations: true };

		if (isEmpty(props.value)) return false;
		if (props.value?.toJSON) payload.value = props.value.toJSON();
		if (props.value?.get) payload.value = props.value.get({ plain: true });

		return props.index === "TICKER"
			? this.updateTickerMemory({
				symbol: payload.symbol,
				index: payload.index,
				value: payload.value,
				canRunAutomations: payload.canRunAutomations,
			})
			: this.setCache({
				symbol: payload.symbol,
				index: payload.index,
				interval: payload.interval,
				value: payload.value,
				canRunAutomations: payload.canRunAutomations,
			});
	}

	async updateTickerMemory(props: BeholderProps) {
		const state = { ...props };

		state.value.priceChange = parseFloat(state.value.priceChange);
		state.value.percentChange = parseFloat(state.value.percentChange);
		state.value.averagePrice = parseFloat(state.value.averagePrice);
		state.value.prevClose = parseFloat(state.value.prevClose);
		state.value.close = parseFloat(state.value.close);
		state.value.closeQty = parseFloat(state.value.closeQty);
		state.value.bestBid = parseFloat(state.value.bestBid);
		state.value.bestBidQty = parseFloat(state.value.bestBidQty);
		state.value.bestAsk = parseFloat(state.value.bestAsk);
		state.value.bestAskQty = parseFloat(state.value.bestAskQty);
		state.value.open = parseFloat(state.value.open);
		state.value.high = parseFloat(state.value.high);
		state.value.low = parseFloat(state.value.low);
		state.value.volume = parseFloat(state.value.volume);
		state.value.quoteVolume = parseFloat(state.value.quoteVolume);

		const currentMemory = await this.getMemory(state.symbol, state.index);

		const newMemory = {} as any;
		newMemory.previous = currentMemory ? currentMemory.current : state.value;
		newMemory.current = state.value;

		this.setCache({
			symbol: state.symbol,
			index: state.index,
			value: newMemory,
			canRunAutomations: state.canRunAutomations,
		});
	}

	async getFiatConversion(stable: string, fiat: string, fiatQty: string) {
		const ticker = await this.getMemory(stable + fiat, "TICKER");

		if (ticker?.current)
			return parseFloat(fiatQty) / parseFloat(ticker.current?.close);

		return 0;
	}

	async getStableConversion(props: {
		baseAsset: string;
		quoteAsset: string;
		baseQty: string;
	}) {
		if (DOLLAR_COINS.includes(props.baseAsset))
			return parseFloat(props.baseQty);

		if (DOLLAR_COINS.includes(props.baseAsset))
			return parseFloat(props.baseQty);

		const ticker = await this.getMemory(
			props.baseAsset + props.quoteAsset,
			"TICKER"
		);

		if (ticker?.current)
			return parseFloat(props.baseQty) * parseFloat(ticker.current.close);

		return 0;
	}

	async tryUsdConvesion(props: ConversionProps) {
		if (DOLLAR_COINS.includes(props.baseAsset)) {
			return parseFloat(props.baseQty);
		}

		if (FIAT_COINS.includes(props.baseAsset)) {
			const converted = await this.getFiatConversion(
				"USDT",
				props.baseAsset,
				props.baseQty
			);

			return converted;
		}

		for (let i = 0; i < DOLLAR_COINS.length; i++) {
			const converted = await this.getStableConversion({
				baseAsset: props.baseAsset,
				quoteAsset: DOLLAR_COINS[i]!,
				baseQty: props.baseQty,
			});

			if (converted > 0) return converted;
		}

		return 0;
	}

	async tryFiatConversion(props: ConversionProps) {
		const state = { ...props } as any;

		if (props?.fiat) state.fiat = props.fiat.toUpperCase();

		if (
			FIAT_COINS.includes(state.baseAsset) &&
			state.baseAsset === state.fiat
		) {
			return parseFloat(state.baseQty);
		}

		const usd = await this.tryUsdConvesion({
			baseAsset: state.baseAsset,
			baseQty: state.baseQty,
		});

		if (!state.fiat || state.fiat === "USD") {
			return usd;
		}

		let ticker = await this.getMemory("USDT" + state.fiat, "TICKER");
		if (ticker?.current) {
			return usd * parseFloat(ticker.current.close);
		}

		ticker = await this.getMemory(state.fiat + "USDT", "TICKER");
		if (ticker?.current) {
			return usd / parseFloat(ticker.current.close);
		}

		return usd;
	}

	static getInstance(): Beholder {
		if (!Beholder.instance) {
			Beholder.instance = new Beholder();
		}
		return Beholder.instance;
	}

	async init(): Promise<void> {
		this.logger.info("Beholder initialized", "core");
	}
}

export default Beholder;
