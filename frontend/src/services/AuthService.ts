import { restClient } from "./BaseService";

export async function doLogin(email: string, password: string) {
	const response = await restClient.send.post(`${restClient.baseUrl}/login`, {
		email,
		password,
	});

	return response.data;
}

export async function doLogout() {
	const response = await restClient.send.post(
		`${restClient.baseUrl}/logout`,
		{}
	);

	return response.data;
}
