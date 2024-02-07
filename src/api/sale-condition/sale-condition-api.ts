import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { SaleCondition } from '@/app/types/SaleCondition';

const URL = '/api/sale-condition';

export const getSaleConditions = async (company_id: number): Promise<AxiosResponse<SaleCondition[]>> => {
	try {
		const params = new URLSearchParams();

		params.append('company_id', company_id.toString());

		const response = await ApiHttp.get<SaleCondition[]>(URL, { params });

		return response;
	} catch (error) {
		throw new Error();
	}
};
