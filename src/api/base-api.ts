import { useUserStore } from './../store/user/user-store';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8001';

/* if (token) {
	axios.defaults.headers.common = {
		Authorization: `Bearer ${token.token}`,
		'Content-Type': 'application/json',
		accept: 'application/json',
	};
} */

const userStore = useUserStore();

axios.interceptors.request.use(
	function (config) {
		console.log('🚀 ~ file: base-api.ts:4 ~ config:', config.url);
		console.log('🚀 ~ file: base-api.ts:15 ~ userStore:', userStore.UserGetter);

		if (config.url?.includes('api')) {
			config.headers['Authorization'] = `${userStore.UserGetter.token_type} ${userStore.UserGetter.access_token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);
/* axios.interceptors.response.use(
	function (config) {
		// Do something before request is sent
		return config;
	},
	function (error) {},
); */

export const ApiHttp = axios;
