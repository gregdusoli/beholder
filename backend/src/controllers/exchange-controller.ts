import ExchangeService from "@services/exchange-service.ts";
import logger from "@utils/logger.ts";
import type { Request, Response } from "express";

class ExchangeController {
	private readonly fiat = process.env.DEFAULT_FIAT ?? "USD";

	constructor(private readonly exchangeService = new ExchangeService()) {}

	async getBalance(req: Request, res: Response) {
		const userId = res.locals.token.id;

		const balance: any = await this.exchangeService.balance();
		balance.fiatEstimate = `~${this.fiat} 100`;
		res.json(balance);
	}
}

export default new ExchangeController();
