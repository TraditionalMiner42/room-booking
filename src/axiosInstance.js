import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://192.168.201.162:4000",
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	async (config) => {
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
