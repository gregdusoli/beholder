import { restClient } from "./BaseService";

const API_URL = import.meta.env.VITE_API_URL;

export async function doLogin(email: string, password: string) {
	const response = await restClient.post(`${API_URL}/login`, {
		email,
		password,
	});

	return response.data;
}

export async function doLogout() {
	const response = await restClient.post(`${API_URL}/logout`, {});

	return response.data;
}
