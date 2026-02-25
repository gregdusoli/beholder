import { hashSync } from 'bcryptjs';
import { randomUUID } from 'crypto';

export default {
	async up(queryInterface, Sequelize) {
		const existingUser = await queryInterface.rawSelect("Users", { limit: 1 }, ["id"]);

		if (existingUser) {
			console.log("Users already exist. Skipping seeding.");
			return;
		}

		await queryInterface.bulkInsert('Users', [{
			id: randomUUID(),
			name: 'Beholder User',
			email: 'beholder@example.com',
			password: hashSync('123456', 10),
			telegramChat: '1234567890',
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		}], {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Users', null, {});
	}
};
