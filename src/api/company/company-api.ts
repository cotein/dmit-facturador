import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { CompanyRawData } from '@/types/Company';

const URL = '/api/company';

export const saveCompany = async (company: CompanyRawData): Promise<AxiosResponse<CompanyRawData>> => {
	try {
		const response = await ApiHttp.post<CompanyRawData>(URL, { company });

		return response;
	} catch (error) {
		console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
		throw new Error('hubo un errrrrrrrrrrrrrrrrroooorrrrrrr');
	}
};
