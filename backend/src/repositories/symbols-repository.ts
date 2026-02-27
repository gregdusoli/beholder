import { SymbolModel } from "@models/symbol-model.ts";

export default class symbolsRepository {
	async bulkInsert(symbols: string[]) {
		const result = await SymbolModel.bulkCreate(symbols as any);

		return result.map((symbol) => symbol.get({ plain: true }));
	}

	async deleteAll() {
		return SymbolModel.destroy({ truncate: true });
	}
}
