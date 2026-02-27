import type { QueryInterface } from "sequelize";
import SymbolsController from "../../../src/controllers/symbols-controller.ts";

export default {
	async up(queryInterface: QueryInterface) {
		await SymbolsController.syncSymbols();
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete("symbols", {});
	},
};
