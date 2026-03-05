import dotenv from "dotenv";
import { Sequelize, type Options, Model } from "sequelize";

dotenv.config();

export class Database {
	private static instance: Database;

	private readonly sequelize: Sequelize;

	private constructor(
		private readonly dbName: string = process.env.DB_NAME!,
		private readonly dbUser: string = process.env.DB_USER!,
		private readonly dbPass: string = process.env.DB_PASS!,
		private readonly config: Options = {
			host: process.env.DB_HOST!,
			port: parseInt(process.env.DB_PORT!),
			dialect: process.env.DB_DIALECT as any,
			logging: process.env.NODE_ENV !== "production" ? console.log : false,
		}
	) {
		this.sequelize = new Sequelize(
			this.dbName,
			this.dbUser,
			this.dbPass,
			this.config
		);
	}

	static getInstance(): Database {
		if (!Database.instance) {
			Database.instance = new Database();
		}
		return Database.instance;
	}

	define<M extends Model>(modelName: string, attributes: any, options?: any) {
		return this.sequelize.define<M>(modelName, attributes, options);
	}

	async init(): Promise<void> {
		try {
			await this.sequelize.authenticate();
			console.log("Database connection established successfully");
		} catch (error) {
			console.error("Unable to connect to database:", error);
			throw error;
		}
	}
}

export default Database;
