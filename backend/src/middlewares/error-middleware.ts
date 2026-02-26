import { ErrorRequestHandler } from "express";
import logger from "@utils/logger.ts";

const errorMiddleware: ErrorRequestHandler = (error, _, res) => {
	const message = error.response ? error.response?.data : error.message;
	logger("error", message);
	res.status(500).send(message);
};

export default errorMiddleware;
