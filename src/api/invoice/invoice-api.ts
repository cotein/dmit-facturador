import type { AxiosError, AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { InvoiceList } from '@/app/types/Invoice';

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
): Promise<AxiosResponse<InvoiceList[]>> => {
	try {
		const params = new URLSearchParams();

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

		params.append('page', page.toString());
		params.append('per_page', per_page.toString());

		//await sleep(1000);

		const response = await ApiHttp.get<InvoiceList[]>(URL, { params });

		return response;
	} catch (error) {
		console.log('🚀 ~ error:', error);
		throw new Error();
	}
};
