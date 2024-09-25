import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { Bank } from '@/app/types/Bank';

const URL = '/api/bank';

export const getBanks = async (name: string | null = null): Promise<AxiosResponse<Bank[]>> => {
    try {
        const params = new URLSearchParams();
        if (name) {
            params.append('name', name.toString());
        }

        const response = await ApiHttp.get<Bank[]>(URL, { params });

        return response;
    } catch (error) {
        throw new Error();
    }
};
