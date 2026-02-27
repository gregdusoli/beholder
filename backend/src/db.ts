import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

class Database {
	static instance: Sequelize;

	static getInstance() {
		if (!Database.instance) {
			Database.instance = new Sequelize(
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
		}
	}
}

Database.getInstance();

export default Database.instance;
