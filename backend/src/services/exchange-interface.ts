export interface Market {
	eventType: string;
	eventTime: number;
	symbol: string;
	priceChange: string;
	percentChange: string;
	averagePrice: string;
	prevClose: string;
	close: string;
	closeQty: string;
	bestBid: string;
	bestBidQty: string;
	bestAsk: string;
	bestAskQty: string;
	open: string;
	high: string;
	low: string;
	volume: string;
	quoteVolume: string;
	openTime: number;
	closeTime: number;
	firstTradeId: number;
	lastTradeId: number;
	numTrades: number;
	toJSON?: () => any;
	get?: (prop?: any) => any;
}
