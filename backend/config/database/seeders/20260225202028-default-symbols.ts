import type { QueryInterface } from "sequelize";
import SymbolsController from "../../../src/controllers/symbols-controller";

export default {
	async up(queryInterface: QueryInterface) {
		await SymbolsController.syncSymbols();
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete("symbols", {});
	},
};
