import { DataTypes, QueryInterface } from "sequelize";

export default {
	async up(queryInterface: QueryInterface) {
		return queryInterface.createTable("symbols", {
			symbol: {
				type: DataTypes.STRING(20),
				allowNull: false,
				primaryKey: true,
			},
			base: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
			quote: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
			stepSize: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
			tickSize: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
			basePrecision: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			quotePrecision: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			minNotional: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
			minLotSize: {
				type: DataTypes.STRING(20),
				allowNull: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		});
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.dropTable("symbols");
	},
};
