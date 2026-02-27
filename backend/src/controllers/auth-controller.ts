import UsersRepository from "@repositories/users-repository.ts";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

class AuthController {
	private blacklist: any = {};

	constructor(private readonly usersRepository = new UsersRepository()) {}

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
		this.blacklist[token] = true;

		setTimeout(() => {
			delete this?.blacklist[token];
		}, Number(process.env.JWT_EXPIRES) * 1000);

		res.status(200).send("Logged out successfully");
	}

	isBlacklisted(token: string) {
		return !!this.blacklist[token];
	}
}

export default new AuthController();
