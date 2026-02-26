import { hashSync } from "bcryptjs";
import { randomUUID } from "crypto";
import type { QueryInterface } from "sequelize";

export default {
	async up(queryInterface: QueryInterface) {
		const existingUser = await queryInterface.rawSelect("users", {}, ["id"])[0];

		if (existingUser) {
			console.log("Users already exist. Skipping seeding.");
			return;
		}

		await queryInterface.bulkInsert(
			"users",
			[
				{
					id: randomUUID(),
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
