import { ExchangeService } from "@services/exchange-service.ts";
import logger from "@utils/logger.ts";
import { Request, Response } from "express";

async function getBalance(req: Request, res: Response) {
	const userId = res.locals.token.id;
	const fiat = process.env.DEFAULT_FIAT ?? "USD";
	const exchange = new ExchangeService();

	try {
		const balance: any = await exchange.balance();
		balance.fiatEstimate = `~${fiat} 100`;
		res.json(balance);
	} catch (error: any) {
		const errorMessage = error.response ? error.response.data : error.message;
		logger("error", `U-${userId}: ${errorMessage}`);
		res.status(500).send(errorMessage);
	}
}

export default {
	getBalance,
};
