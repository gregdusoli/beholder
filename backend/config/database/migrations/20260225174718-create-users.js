import { DataTypes } from "sequelize";

export default {
	up: async (queryInterface) => {
		await queryInterface.createTable("Users", {
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				allowNull: false,
				primaryKey: true
			},
			name: {
				type: DataTypes.STRING(150),
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING(150),
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			telegramChat: {
				type: DataTypes.STRING(100),
			},
			isActive: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			createdAt: DataTypes.DATE,
			updatedAt: DataTypes.DATE,
		});
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable("Users");
	},
};
