import type { SimpleXMLElementArba } from '@/app/types/Arba';
import { ApiHttp } from '../base-api';

export const apiArbaAlicuotaPorSujeto = async (cuit: number): Promise<SimpleXMLElementArba> => {
    const url: string = '/api/arba/alicuota_por_sujeto';

    const { data } = await ApiHttp.post<SimpleXMLElementArba>(url, { cuit });

    return data;
};
