import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { ErrorData } from '@/app/types/Request';
import type { Product } from '@/app/types/Product';

const URL = '/api/product';

export const saveProduct = async (payload: {
    company_id: number;
    product: object;
}): Promise<AxiosResponse<Product> | undefined> => {
    try {
        const response = await ApiHttp.post(URL, {
            company_id: payload.company_id,
            product: payload.product,
        });

        return response;
    } catch (error: any) {
        if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
            console.error(' product ' + error.response?.data.message);
            throw new Error(error.response?.data.message);
        }
        throw new Error(error);
    }
};

export const getProducts = async (
    company_id: number | undefined,
    name: string = '',
): Promise<AxiosResponse<Product[]> | undefined> => {
    try {
        const params = new URLSearchParams();

        params.append('company_id', company_id!.toString());

        if (name != '') {
            params.append('name', name);
        }
        const response = await ApiHttp.get<Product[]>(URL, { params });

        return response;
    } catch (error: any) {
        if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
            console.error(' product ' + error.response?.data.message);
            throw new Error(error.response?.data.message);
        }
        throw new Error(error);
    }
};
