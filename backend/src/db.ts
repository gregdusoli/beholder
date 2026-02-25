import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
	process.env.DB_NAME!,
	process.env.DB_USER!,
	process.env.DB_PASS!,
	{
		dialect: process.env.DB_DIALECT as any,
		host: process.env.DB_HOST!,
		port: parseInt(process.env.DB_PORT!),
		logging: process.env.NODE_ENV !== "production" ? console.log : false,
	}
);

export default sequelize;
