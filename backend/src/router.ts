import { Router } from "express";
import authController from "./controllers/auth-controller.ts";

const router = Router();

router.get("/health", (_, res) => {
	res.status(200).send("Service is healthy");
});

router.post("/login", authController.doLogin);

router.post("/logout", authController.doLogout);

router.use("/", (_, res) => {
	res.status(400).send("Bad Request");
});

export default router;
