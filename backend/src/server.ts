import logger from "@utils/logger.ts";
import app from "./app.ts";

const port = process.env.APP_PORT;

async function start() {
	logger("info", `Your Node.js version is ${process.version}`);
	logger("info", `Starting ${process.env.APP_NAME} application...`);
}

app.listen(port, () => {
	logger("success", `Server is running on port ${port}`);
});

start();
