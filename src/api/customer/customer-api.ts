import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { Sujeto } from '@/app/types/Company';

const URL = '/api/customer';

export const saveCustomer = async (customer: Sujeto): Promise<AxiosResponse<Sujeto>> => {
	try {
		const response = await ApiHttp.post<Sujeto>(URL, { customer });

		return response;
	} catch (error) {
		console.log('🚀 ~ file: saveCustomere rror:', error);
		throw new Error('hubo un saveCustomer');
	}
};

export const getCustomers = async (company_id: number, name: string = '') => {
	try {
		const params = new URLSearchParams();

		params.append('company_id', String(company_id));
		params.append('name', name);

		const { data } = await ApiHttp.get<[]>(URL, { params });

		return data;
	} catch (error) {
		throw new Error();
	}
};
