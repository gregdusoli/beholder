import type { QueryInterface } from "sequelize";
import symbolsController from "../../../src/controllers/symbols-controller.ts";

export default {
	async up(queryInterface: QueryInterface) {
		await symbolsController.syncSymbols();
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete("symbols", {});
	},
};
