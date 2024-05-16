import type { AxiosError, AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { InvoiceList, InvoiceListWithPagination } from '@/app/types/Invoice';

import { useSleepComposable } from '@/app/composables/sleep/useSleepComposable';
const { sleep } = useSleepComposable();
const URL = '/api/invoice';

type ErrorData = {
	message: string;
	errors: Record<string, string[]>;
};

export const getInvoiceList = async (
	company_id: number,
	customer_id: number,
	status_id: number,
	from: string,
	to: string,
	page: number = 1,
	per_page: number = 10,
	print: string = 'no',
	invoice_id: number | null = null,
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

		//await sleep(1000);

		const response = await ApiHttp.get<InvoiceListWithPagination>(URL, { params });

		return response;
	} catch (error) {
		console.log('🚀 ~ error:', error);
		throw new Error();
	}
};

/* export const getInvoiceData = async (invoice_id: number):Promise<AxiosResponse<InvoiceList>> => {

	try {
		const params = new URLSearchParams();

	} catch (error) {
		console.log('🚀 ~ error:', error);
		throw new Error();
	}
} */
