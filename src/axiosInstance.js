import axios from "axios";

// Create axios instance for API request
const axiosInstance = axios.create({
	baseURL: "http://192.168.201.34:4000/",
	headers: {
		"Content-Type": "application/json",
	},
});

// Intercept all outgoing request made through axiosInstance
axiosInstance.interceptors.request.use(
	async (config) => {
		// Ensures that every outgoing request made through axiosInstance includes an Authorization header with a Bearer token
		// *(in case there's already a token)
		const token = localStorage.getItem("accessToken");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
