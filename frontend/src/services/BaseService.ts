import axios from "axios";

axios.interceptors.request.use(
	(config) => {
		const session = localStorage.getItem("session");

		if (session) {
			const token = JSON.parse(session).token;
			config.headers.Authorization = token;
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

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export const restClient = axios;
