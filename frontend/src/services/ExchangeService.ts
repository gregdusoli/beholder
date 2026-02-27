import { restClient } from "./BaseService";

export async function getBalance() {
	const response = await restClient.get(`/exchange/balance`);

	return response.data;
}
