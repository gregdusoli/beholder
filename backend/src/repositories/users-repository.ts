import { UserModel } from "@models/user-model.ts";

export default class UsersRepository {
	async getUserByEmail(email: string) {
		const result = await UserModel.findOne({ where: { email } });

		return result?.get({ plain: true });
	}

	async getActiveUsers() {
		const result = await UserModel.findAll({
			where: { isActive: true },
			include: [{ all: true, nested: true }],
		});

		return result.map((user) => user.get({ plain: true }));
	}
}
