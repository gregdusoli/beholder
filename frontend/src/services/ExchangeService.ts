import { restClient } from "./BaseService";

export async function getBalance() {
	const response = await restClient.send.get(
		`${restClient.baseUrl}/exchange/balance`
	);

	return response.data;
}
