import usersRepository from "@repositories/users-repository.ts";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const blacklist = {} as any;

async function doLogin(req: Request, res: Response) {
	const { email, password } = req.body;

	const user: any = await usersRepository.getUserByEmail(email);
	if (!user || !user.isActive) {
		return res.status(401).send("Unauthorized");
	}

	const isValid = bcrypt.compareSync(password, user.password);
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

async function doLogout(req: Request, res: Response) {
	const token: string = req.headers["authorization"]!;
	blacklist[token] = true;

	setTimeout(() => {
		delete blacklist[token];
	}, Number(process.env.JWT_EXPIRES) * 1000);

	res.status(200).send("Logged out successfully");
}

function isBlacklisted(token: string) {
	return !!blacklist[token];
}

export default { doLogin, doLogout, isBlacklisted };
