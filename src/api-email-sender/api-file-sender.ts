import type { SenderEmailData } from '@/app/types/Email';
import axios from 'axios';

// Crear una instancia de Axios para la API de reportes
const emailSenderAxios = axios.create({
    baseURL: import.meta.env.VITE_API_EMAIL_SENDER_URL, // Reemplaza con la URL base de la API de reportes
});

axios.interceptors.request.use(
    function (config) {
        if (config.url?.includes('api')) {
            config.headers['Accept'] = 'application/json';
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

export const sendEmail = async (url: string, fileName: string, data: SenderEmailData) => {
    const urlHttp = `${url}`;

    try {
        const response = await emailSenderAxios.post(urlHttp, data);
        console.log('🚀 ~ sendEmail ~ response:', response);

        return response;
    } catch (error) {
        console.error(`Error fetching report from ${url}:`, error);
        throw error;
    }
};
