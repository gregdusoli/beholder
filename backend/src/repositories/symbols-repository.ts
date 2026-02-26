import symbolModel from "@models/symbol-model.ts";

async function bulkInsert(symbols: string[]) {
	return symbolModel.bulkCreate(symbols as any);
}

async function deleteAll() {
	return symbolModel.destroy({ truncate: true });
}

export default { bulkInsert, deleteAll };
