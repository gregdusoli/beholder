import authController from "@controllers/auth-controller.ts";
import authMiddleware from "@middlewares/auth-middleware.ts";
import exchangeController from "@controllers/exchange-controller.ts";
import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
	res.status(200).send("Service is healthy");
});

router.post("/login", authController.doLogin);

router.post("/logout", authController.doLogout);

router.get("/exchange/balance", authMiddleware, exchangeController.getBalance);

router.use("/", (_, res) => {
	res.status(400).send("Bad Request");
});

export default router;
