import { DataTypes, Model } from "sequelize";
import database from "../db.ts";
import { SymbolEntity } from "@entities/symbol-entity.ts";

export const SymbolModel = database.define<Model<SymbolEntity>>("symbol", {
	symbol: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	base: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	quote: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	stepSize: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	tickSize: {
		type: DataTypes.STRING,
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
		type: DataTypes.STRING,
		allowNull: false,
	},
	minLotSize: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	createdAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
	updatedAt: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
});
