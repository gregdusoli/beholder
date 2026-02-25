type LogLevel = "info" | "warn" | "error" | "success";

export default (key: LogLevel = "info", data: any) => {
	let content;

	try {
		content = JSON.parse(data);
	} catch (error) {
		content = data;
	}

	const message = `\n[${key}] ${content}`;

	if (key === "success") {
		console.log(`\x1b[32m${message}\x1b[0m`);
		return;
	}

	if (key === "error") {
		console.error(`\x1b[31m${message}\x1b[0m`);
		return;
	}

	if (key === "warn") {
		console.warn(`\x1b[33m${message}\x1b[0m`);
		return;
	}

	console.log(message);
};
