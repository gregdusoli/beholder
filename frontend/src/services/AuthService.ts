import { restClient } from "./BaseService";

export async function doLogin(email: string, password: string) {
	const response = await restClient.post(`/login`, {
		email,
		password,
	});

	return response.data;
}

export async function doLogout() {
	const response = await restClient.post(`/logout`, {});

	return response.data;
}
