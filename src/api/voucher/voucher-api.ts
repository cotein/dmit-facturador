import { ApiHttp } from '../base-api';
import type { ErrorData } from '@/app/types/Request';

const URL = '/api/voucher';

export const getVouchers = async (company_inscription_id: number) => {
	try {
		const params = new URLSearchParams();

		params.append('company_inscription_id', String(company_inscription_id));

		const { data } = await ApiHttp.get<[]>(URL, { params });

		return data;
	} catch (error) {
		if (ApiHttp.isAxiosError<ErrorData, Record<string, unknown>>(error)) {
			console.error(' voucher ' + error.response?.data.message);
			throw new Error(error.response?.data.message);
		}
	}
};
