import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { ErrorData } from '@/app/types/Request';
import type { ListProductItem, Product } from '@/app/types/Product';
import type { Pagination } from '@/app/types/Invoice';

const URL = '/api/product';

export const saveProduct = async (payload: {
    company_id: number;
    product: any;
}): Promise<AxiosResponse<Product> | undefined> => {
    try {
        const response = await ApiHttp.post(URL, {
            company_id: payload.company_id,
            product: payload.product,
        });

        return response;
    } catch (error: any) {
        if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
            throw new Error(error.response?.data.message);
        }
        throw new Error(error);
    }
};

export const updateProduct = async (payload: {
    company_id: number;
    product: any;
}): Promise<AxiosResponse<Product> | undefined> => {
    try {
        const response = await ApiHttp.put(`${URL}/${payload.product.id}`, {
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

type ProductListWithPagination = {
    data: ListProductItem[];
    pagination: Pagination;
};
export const fetchProducts = async (
    company_id: number | undefined,
    list: string = 'list',
    page: number | null = 1,
    per_page: number | null = 1,
): Promise<AxiosResponse<ProductListWithPagination> | undefined> => {
    try {
        const params = new URLSearchParams();

        params.append('company_id', company_id!.toString());

        params.append('list', list.toString());

        if (page != null) {
            params.append('page', page.toString());
        }

        if (per_page != null) {
            params.append('per_page', per_page.toString());
        }

        const response = await ApiHttp.get<ProductListWithPagination>(URL, { params });

        return response;
    } catch (error: any) {
        if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
            console.error(' product ' + error.response?.data.message);
            throw new Error(error.response?.data.message);
        }
        throw new Error(error);
    }
};

export const getTotalProducts = async (company_id: number | undefined, dashboard: string = 'yes'): Promise<number> => {
    try {
        const params = new URLSearchParams();

        params.append('company_id', company_id!.toString());

        if (dashboard) params.append('dashboard', dashboard.toString());

        const response = await ApiHttp.get<number>(URL, { params });

        return response.data;
    } catch (error: any) {
        if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
            console.error(' product ' + error.response?.data.message);
            throw new Error(error.response?.data.message);
        }
        throw new Error(error);
    }
};
