import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
	res.status(200).send("Service is healthy");
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;
	// Perform login logic here
	res.send("Login");
});

export default router;
