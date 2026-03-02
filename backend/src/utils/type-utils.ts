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
