import axios from 'axios';

// Crear una instancia de Axios para la API de reportes
const reportsAxios = axios.create({
    baseURL: import.meta.env.VITE_API_REPORTS_URL, // Reemplaza con la URL base de la API de reportes
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

export const fetchReport = async (url: string, fileName: string, data: any) => {
    const urlHttp = `${url}`;

    try {
        const response = await reportsAxios.post(urlHttp, data, {
            responseType: 'blob', // Configura la respuesta como un blob
        });

        // Crea un enlace temporal para descargar el archivo PDF
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

        const link = document.createElement('a');

        link.href = downloadUrl;

        link.setAttribute('download', fileName); // Nombre del archivo PDF

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        return response.data;
    } catch (error) {
        console.error(`Error fetching report from ${url}:`, error);
        throw error;
    }
};
