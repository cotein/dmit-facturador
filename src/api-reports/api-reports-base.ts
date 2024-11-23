import axios from 'axios';
//axios.defaults.baseURL = 'https://api.dmit.ar';
axios.defaults.baseURL = import.meta.env.VITE_URL_BASE_API;

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

const apiReportsUrl = import.meta.env.VITE_API_REPORTS_URL;

export const fetchReport = async (url: string, fileName: string, data: any) => {
    const urlHttp = `${apiReportsUrl}/${url}`;

    try {
        const response = await axios.post(urlHttp, data, {
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
