import ExchangeService from "@services/exchange-service";
import type { Request, Response } from "express";
import Beholder from "../beholder";

class ExchangeController {
	private readonly fiat = process.env.DEFAULT_FIAT ?? "USD";

	constructor(
		private readonly beholder = Beholder.getInstance(),
		private readonly exchangeService = new ExchangeService()
	) { }

	async getBalance(req: Request, res: Response) {
		try {
			const info: any = await this.exchangeService.balance();
			const coins = Object.keys(info);

			const partials = await Promise.all(
				coins.map(async (coin) => {
					let partial =
						parseFloat(info[coin].available) + parseFloat(info[coin].onOrder);

					if (partial > 0) {
						const estimate = await this.beholder.tryFiatConversion({
							baseAsset: coin,
							baseQty: String(partial),
							fiat: this.fiat,
						});

						info[coin].fiatEstimate = estimate;
						return estimate;
					}
					info[coin].fiatEstimate = 0;
					return 0;
				})
			);

			const total = partials.reduce((acc, p) => acc + p, 0);
			info.fiatEstimate = `~${this.fiat} ${total.toFixed(2)}`;

			res.json(info);
		} catch (error) { }
	}
}

export default new ExchangeController();
