import Logger from "@utils/logger.ts";
import { ErrorRequestHandler } from "express";

const logger = Logger.getInstance();

const errorMiddleware: ErrorRequestHandler = (error, _, res) => {
	const message = error.response ? error.response?.data : error.message;

	logger.error(message, "application");
	res.status(500).send(message);
};

export default errorMiddleware;
