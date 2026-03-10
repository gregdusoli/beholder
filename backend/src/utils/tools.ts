import * as dotenv from "dotenv";

dotenv.config();

export function isEmpty(value: any) {
	const target = typeof value === "string" ? value.trim() : value;

	if (target === undefined || target === null || target === "") {
		return true;
	}

	try {
		const obj = JSON.parse(target);
		return Object.keys(obj).length <= 0;
	} catch {
		return Object.keys(target).length <= 0;
	}
}

export function getCorsOrigins(origins: string): string[] {
	return origins.split('|').map(origin => origin.trim()) ?? [];
}

export function validateCorsOrigin(origin: string): boolean {
	const corsOrigins = getCorsOrigins(process.env.CORS_ORIGINS ?? '');
	return corsOrigins.includes('*') ?? corsOrigins.includes(origin);
}
