import type { UserTokenGetterType } from '@/app/types/User';
import { useUserStore } from '@/app/store/user/user-store';
import axios from 'axios';

axios.defaults.baseURL = 'http://api.dmit.ar';

const userStore = useUserStore();

axios.interceptors.request.use(
	function (config) {
		if (config.url?.includes('api')) {
			const user: UserTokenGetterType | any = userStore.UserTokenGetter;
			config.headers['Accept'] = 'application/json';
			config.headers['Content-Type'] = 'application/json';
			config.headers['Authorization'] = `${user.token_type} ${user.access_token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

export const ApiHttp = axios;
