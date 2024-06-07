import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { Category, CategoryRawData } from '@/app/types/Category';

const URL = '/api/category';

export const saveCategory = async (category: CategoryRawData): Promise<AxiosResponse<Category[]>> => {
    try {
        const response = await ApiHttp.post<Category[]>(URL, { category });

        return response;
    } catch (error) {
        console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
        throw new Error('hubo un error saveCategory');
    }
};

export const getCategories = async (
    company_id: number,
    category_id: number = 0,
): Promise<AxiosResponse<Category[]>> => {
    try {
        const params = new URLSearchParams();

        params.append('company_id', company_id.toString());

        if (!(category_id === 0)) {
            params.append('category_id', category_id.toString());
        }

        const response = await ApiHttp.get<Category[]>(URL, { params });

        return response;
    } catch (error) {
        throw new Error();
    }
};
