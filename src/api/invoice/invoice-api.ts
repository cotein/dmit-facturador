import type { AxiosError, AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { InvoiceList, InvoiceListWithPagination } from '@/app/types/Invoice';

import { useSleepComposable } from '@/app/composables/sleep/useSleepComposable';
import { PAGINATION_ITEMS_PER_PAGE } from '@/app/types/Constantes';
const { sleep } = useSleepComposable();
const URL = '/api/invoice';

type ErrorData = {
    message: string;
    errors: Record<string, string[]>;
};

export const getInvoiceList = async (
    company_id: number,
    customer_id: number | null = null,
    status_id: number | null = null,
    from: string | null = null,
    to: string | null = null,
    page: number | null = 1,
    per_page: number | null = PAGINATION_ITEMS_PER_PAGE,
    print: string = 'no',
    invoice_id: number | null = null,
    getPaymentOnReceipt: boolean = false,
): Promise<AxiosResponse<InvoiceListWithPagination>> => {
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

        if (print != null) {
            params.append('print', print.toString());
        }

        if (invoice_id != null) {
            params.append('invoice_id', invoice_id.toString());
        }

        if (page != null) {
            params.append('page', page.toString());
        }

        if (per_page != null) {
            params.append('per_page', per_page.toString());
        }

        if (getPaymentOnReceipt != null && getPaymentOnReceipt) {
            params.append('getPaymentOnReceipt', 'getPaymentOnReceipt');
        }
        //await sleep(1000);

        const response = await ApiHttp.get<InvoiceListWithPagination>(URL, { params });

        return response;
    } catch (error) {
        console.log('🚀 ~ error:', error);
        throw new Error();
    }
};

export const getInvoiceComments = async (
    company_id: number,
    customer_id: number | null = null,
    page: number | null = 1,
    per_page: number | null = PAGINATION_ITEMS_PER_PAGE,
): Promise<AxiosResponse<any>> => {
    try {
        const params: URLSearchParams = new URLSearchParams();

        params.append('comments', 'comments');

        if (company_id != null) {
            params.append('company_id', company_id.toString());
        }

        if (customer_id != null) {
            params.append('customer_id', customer_id.toString());
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
