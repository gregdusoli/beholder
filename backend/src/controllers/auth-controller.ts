import UsersRepository from "@repositories/users-repository";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class AuthController {
	private static blacklist: any = {};

	constructor(
		private readonly usersRepository = new UsersRepository()
	) { }

	static isBlacklisted(token: string) {
		return !!AuthController.blacklist[token];
	}

	async doLogin(req: Request, res: Response) {
		const { email, password } = req.body;

		const user: any = await this.usersRepository.getUserByEmail(email);
		if (!user || !user.isActive) {
			return res.status(401).send("Unauthorized");
		}

		const isValid = await bcrypt.compare(password, user.password);
		if (!isValid) {
			return res.status(401).send("Unauthorized");
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
			expiresIn: Number(process.env.JWT_EXPIRES) || 3600,
		});

		return res.json({
			id: user.id,
			token,
		});
	}

	async doLogout(req: Request, res: Response) {
		const token: string = req.headers["authorization"]!;
		AuthController.blacklist[token] = true;

		setTimeout(() => {
			delete AuthController?.blacklist[token];
		}, Number(process.env.JWT_EXPIRES) * 1000);

		res.status(200).send("Logged out successfully");
	}
}

export default new AuthController();
