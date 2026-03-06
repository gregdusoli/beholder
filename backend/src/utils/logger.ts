import type { LogLevel, LogOrigin } from "@interfaces/logger";

export class Logger {
	private static instance: Logger;

	private readonly debugLogsOn: boolean;

	private readonly appLogsOn: boolean;

	private readonly exchangeLogsOn: boolean;

	private constructor() {
		this.debugLogsOn = process.env.DEBUG_LOGS === "true";
		this.appLogsOn = process.env.APP_LOGS === "true";
		this.exchangeLogsOn =
			process.env.EXCHANGE_LOGS === "minimal" ||
			process.env.EXCHANGE_LOGS === "verbose";
	}

	static getInstance(): Logger {
		if (!Logger.instance) {
			Logger.instance = new Logger();
		}
		return Logger.instance;
	}

	private shouldAct(origin: LogOrigin, level?: LogLevel) {
		if (origin === "application" && !this.appLogsOn) return false;
		if (origin === "exchange" && !this.exchangeLogsOn) return false;
		if (level && level === "debug" && !this.debugLogsOn) return false;
		return true;
	}

	private buildMessage(key: LogLevel, data: any): string {
		let content;

		try {
			content = JSON.parse(data);
		} catch (error) {
			content = data;
		}

		return `\n[${key}] ${content}`;
	}

	info(data: any, origin: LogOrigin): void {
		if (!this.shouldAct(origin)) return;

		const message = this.buildMessage("info", data);

		console.log(`\x1b[36m${message}\x1b[0m`);
	}

	success(data: any, origin: LogOrigin): void {
		if (!this.shouldAct(origin)) return;

		const message = this.buildMessage("success", data);

		console.log(`\x1b[32m${message}\x1b[0m`);
	}

	warn(data: any, origin: LogOrigin): void {
		if (!this.shouldAct(origin)) return;

		const message = this.buildMessage("warn", data);

		console.warn(`\x1b[33m${message}\x1b[0m`);
	}

	debug(data: any, origin: LogOrigin): void {
		if (!this.shouldAct(origin, "debug")) return;

		const message = this.buildMessage("debug", data);

		console.debug(`\x1b[34m${message}\x1b[0m`);
	}

	error(data: any, origin: LogOrigin): void {
		if (!this.shouldAct(origin)) return;

		const message = this.buildMessage("error", data);

		console.error(`\x1b[31m${message}\x1b[0m`);
	}
}

export default Logger;
