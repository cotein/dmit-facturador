import type { UserToken } from '@/app/types/User';
import { useUserStore } from '@/app/store/user/user-store';
import axios from 'axios';

//
if (import.meta.env.MODE === 'development') {
    axios.defaults.baseURL = 'http://localhost:7000';
    console.log('🚀 ~ axios.defaults.baseURL:', axios.defaults.baseURL);
}
if (import.meta.env.MODE === 'production') {
    axios.defaults.baseURL = 'https://api.dmit.ar';
    console.log('🚀 ~ axios.defaults.baseURL:', axios.defaults.baseURL);
}

const userStore = useUserStore();

axios.interceptors.request.use(
    function (config) {
        if (config.url?.includes('api')) {
            const user: UserToken | any = userStore.UserTokenGetter;
            config.headers['Accept'] = 'application/json';
            //config.headers['Content-Type'] = 'application/json';
            config.headers['Authorization'] = `${user.token_type} ${user.access_token}`;

            if (config.url.includes('upload')) {
                config.headers['Content-Type'] = 'multipart/form-data';
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

export const ApiHttp = axios;
