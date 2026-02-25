import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const blacklist = {} as any;

async function doLogin(req: Request, res: Response) {
	const { email, password } = req.body;

	if (email === "gui.vabi@gmail.com" && password === "123456") {
		const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET!, {
			expiresIn: Number(process.env.JWT_EXPIRES) || 3600,
		});

		return res.json({
			id: 1,
			token,
		});
	}

	res.status(401).send("Unauthorized");
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
