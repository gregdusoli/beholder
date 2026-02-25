import axios from "axios";

axios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => Promise.reject(error)
);

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			console.warn("Unauthorized, redirected to login page");

			if (window.location.pathname !== "/") {
				window.location.href = "/";
			}
		}

		return Promise.reject(error.response ? error.response.data : error);
	}
);

export const restClient = axios;
