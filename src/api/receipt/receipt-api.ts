import type { DocumentCancelation } from './../../app/types/Receipt';
import type { AxiosError, AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import { PAGINATION_ITEMS_PER_PAGE, PAGINATION_PAGE_ONE } from '@/app/types/Constantes';

const URL = '/api/receipt';

export const createReceipt = async (
    invoicesToCancel: any[],
    documentsCancelation: DocumentCancelation[],
    saldo: number,
): Promise<AxiosResponse<any>> => {
    try {
        const response = await ApiHttp.post(URL, {
            invoicesToCancel,
            documentsCancelation,
            saldo,
        });

        return response;
    } catch (error: any) {
        if (ApiHttp.isAxiosError<AxiosError, Record<string, unknown>>(error)) {
            console.error(' product ' + error.response?.data.message);
            throw new Error(error.response?.data.message);
        }
        throw new Error(error);
    }
};

export const getReceipts = async (
    company_id: number,
    customer_id: number | null = null,
    status_id: number | null = null,
    from: string | null = null,
    to: string | null = null,
    page: number | null = PAGINATION_PAGE_ONE,
    per_page: number | null = PAGINATION_ITEMS_PER_PAGE,
): Promise<AxiosResponse<any>> => {
    try {
        const params: URLSearchParams = new URLSearchParams();

        if (company_id != null) {
            params.append('company_id', company_id.toString());
        }

        if (customer_id != null) {
            params.append('customer_id', customer_id.toString());
        }

        if (status_id != null) {
            params.append('status_id', status_id.toString());
        }

        if (from != null) {
            params.append('from', from);
        }

        if (to != null) {
            params.append('to', to);
        }

        if (page != null) {
            params.append('page', page.toString());
        }

        if (per_page != null) {
            params.append('per_page', per_page.toString());
        }

        //await sleep(1000);

        const response = await ApiHttp.get<any>(URL, { params });

        return response;
    } catch (error) {
        console.log('🚀 ~ error:', error);
        throw new Error();
    }
};

export const getReceiptById = async (receipt_id: number): Promise<AxiosResponse<any>> => {
    try {
        const response = await ApiHttp.get<any>(`${URL}/${receipt_id}`);
        return response;
    } catch (error) {
        console.error('Error fetching receipt:', error);
        throw error;
    }
};
