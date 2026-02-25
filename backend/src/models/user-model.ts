import { DataTypes } from "sequelize";
import database from "../db.ts";

const userModel = database.define("User", {
	id: {
		type: DataTypes.UUID,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
	telegramChat: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
});

export default userModel;
