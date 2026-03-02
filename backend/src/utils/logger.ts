type LogLevel = "info" | "warn" | "error" | "success";
type LogOrigin = "core" | "application" | "exchange";

const appLogsOn = process.env.APP_LOGS === "true";
const exchangeLogsOn =
	process.env.EXCHANGE_LOGS === "minimal" ||
	process.env.EXCHANGE_LOGS === "verbose";

export default (
	key: LogLevel = "info",
	data: any,
	origin: LogOrigin = "application"
) => {
	let content;

	if (origin === "application" && !appLogsOn) return;
	if (origin === "exchange" && !exchangeLogsOn) return;

	try {
		content = JSON.parse(data);
	} catch (error) {
		content = data;
	}

	const message = `\n[${key}] ${content}`;

	const logging: Record<LogLevel, (msg: string) => void> = {
		["info"]: (msg) => console.log(`\x1b[36m${msg}\x1b[0m`),
		["warn"]: (msg) => console.warn(`\x1b[33m${msg}\x1b[0m`),
		["error"]: (msg) => console.error(`\x1b[31m${msg}\x1b[0m`),
		["success"]: (msg) => console.log(`\x1b[32m${msg}\x1b[0m`),
	};

	logging[key](message);
};
