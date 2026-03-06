import AuthController from "@controllers/auth-controller";
import Logger from "@utils/logger";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const logger = Logger.getInstance();

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers["authorization"];
	const authController = AuthController;

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
			logger.error(`Invalid token: ${error}`, "application");
		}
	}

	res.status(401).send("Unauthorized");
};

export default authMiddleware;
