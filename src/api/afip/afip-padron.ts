import type { PersonaReturn } from '@/app/types/Afip';
import { ApiHttp } from '../base-api';

export const apiAfipGetCompanyDataByCuit = async (cuit: any): Promise<PersonaReturn> => {
    const { data } = await ApiHttp.post<PersonaReturn>('/api/afip/getCompanyDataByPadron', { cuit });

    return data;
};
