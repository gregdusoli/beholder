import { Request, Response, NextFunction } from "express";
import authController from "../controllers/auth-controller.ts";
import logger from "../utils/logger.ts";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers["authorization"];

	if (token) {
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET!);

			if (decoded) {
				const isBlacklisted = authController.isBlacklisted(token);

				if (!isBlacklisted) {
					res.locals.token = decoded;
					return next();
				}
			}
		} catch (error) {
			logger("error", `Invalid token: ${error}`);
		}
	}

	res.status(401).send("Unauthorized");
};
