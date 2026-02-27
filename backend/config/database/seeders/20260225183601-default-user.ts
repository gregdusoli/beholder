import { hashSync } from "bcryptjs";
import { QueryTypes, type QueryInterface } from "sequelize";

export default {
	async up(queryInterface: QueryInterface, Sequelize) {
		const existingUser = await queryInterface.sequelize.query(
			"SELECT * FROM users LIMIT 1",
			{
				type: QueryTypes.SELECT,
			}
		);

		if (existingUser?.length) {
			return console.log("Users already exist, skipping seeding");
		}

		await queryInterface.bulkInsert(
			"users",
			[
				{
					id: crypto.randomUUID(),
					name: "Beholder User",
					email: "beholder@example.com",
					password: hashSync("123456", 10),
					telegramChat: "1234567890",
					isActive: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	async down(queryInterface: QueryInterface) {
		await queryInterface.bulkDelete("users", {});
	},
};
