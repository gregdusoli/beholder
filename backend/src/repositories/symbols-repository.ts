import { SymbolEntity } from "@entities/symbol-entity";
import { SymbolModel } from "@models/symbol-model";

export default class SymbolRepository {
	async bulkInsert(symbols: string[]) {
		const result = await SymbolModel.bulkCreate(symbols as any);

		return result.map((symbol: any) => symbol.get({ plain: true }));
	}

	async getSymbols(): Promise<SymbolEntity[]> {
		const res = await SymbolModel.findAll();
		return res.map((symbol: any) => symbol.get({ plain: true }));
	}

	async deleteAll() {
		return SymbolModel.destroy({ truncate: true });
	}
}
