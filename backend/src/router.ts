import AuthController from "@controllers/auth-controller";
import ExchangeController from "@controllers/exchange-controller";
import AuthMiddleware from "@middlewares/auth-middleware";
import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
	res.status(200).send("Service is healthy");
});

router.post("/login", AuthController.doLogin.bind(AuthController));

router.post(
	"/logout",
	AuthMiddleware,
	AuthController.doLogout.bind(AuthController)
);

router.get(
	"/exchange/balance",
	AuthMiddleware,
	ExchangeController.getBalance.bind(ExchangeController)
);

router.use("/", (_, res) => {
	res.status(400).send("Bad Request");
});

export default router;
