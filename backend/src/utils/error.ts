export function getErrorMessage(error: any) {
	try {
		const err = JSON.parse(error);
		return err?.body ? err.body : err.message;
	} catch (error) {
		return error;
	}
}
