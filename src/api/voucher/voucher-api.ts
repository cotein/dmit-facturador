import { ApiHttp } from '../base-api';
import type { ErrorData } from '@/app/types/Request';

const URL = '/api/voucher';

export const getVouchers = async (
    company_inscription_id: number,
    customer_inscription_id: number | null,
    context: string | null = null,
) => {
    try {
        const params = new URLSearchParams();

        params.append('company_inscription_id', String(company_inscription_id));

        if (customer_inscription_id != null) {
            params.append('customer_inscription_id', String(customer_inscription_id));
        }

        if (context != null) {
            params.append('context', context);
        }

        const { data } = await ApiHttp.get<[]>(URL, { params });

        return data;
    } catch (error) {
        // Antes, un error que no fuera de Axios salía de la función devolviendo
        // `undefined`: quien llamaba recibía datos vacíos en vez de enterarse de que
        // la lista de comprobantes no se pudo traer. Ahora siempre se propaga.
        if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
            throw new Error(error.response?.data.message ?? 'No se pudieron obtener los comprobantes.');
        }

        throw error instanceof Error ? error : new Error('No se pudieron obtener los comprobantes.');
    }
};
