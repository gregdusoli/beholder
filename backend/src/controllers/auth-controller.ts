import { Request, Response } from "express";

async function doLogin(req: Request, res: Response) {
	const { email, password } = req.body;

	if (email === "gui.vabi@gmail.com" && password === "123456") {
		return res.json({
			id: 1,
			token: "fake-jwt-token",
		});
	}

	res.status(401).send("Unauthorized");
}

async function doLogout(_: Request, res: Response) {
	res.status(200).send("Logged out successfully");
}

export default { doLogin, doLogout };
