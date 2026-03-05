import Logger from "@utils/logger.ts";
import Application from "./application.ts";

async function bootstrap(): Promise<void> {
	try {
		const application = Application.getInstance();
		await application.start();
	} catch (error) {
		Logger.getInstance().error(`Failed to start application: ${error}`, "core");
		process.exit(1);
	}
}

bootstrap();
