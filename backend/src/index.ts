import Logger from "@utils/logger";
import Application from "./application";

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
