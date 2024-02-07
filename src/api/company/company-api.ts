import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { Company, CompanyRawData } from '@/app/types/Company';

const URL = '/api/company';

export const saveCompany = async (company: CompanyRawData): Promise<AxiosResponse<Company[]>> => {
	try {
		const response = await ApiHttp.post<Company[]>(URL, { company });

		return response;
	} catch (error) {
		console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
		throw new Error('hubo un errrrrrrrrrrrrrrrrroooorrrrrrr');
	}
};
export const updateCompany = async (company: Company): Promise<AxiosResponse<Company[]>> => {
	try {
		const params = new URLSearchParams();

		params.append('updateCompany', 'updateCompany');

		const response = await ApiHttp.put<Company[]>(`${URL}/${company.id}`, { company }, { method: 'PUT' });
		return response;
	} catch (error) {
		console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
		throw new Error('hubo un updateCompany');
	}
};

export const updateCompanyPtoVta = async (company_id: number, pto_vta_fe: number): Promise<AxiosResponse<Company>> => {
	try {
		const params = new URLSearchParams();

		params.append('company_id', company_id.toString());
		params.append('pto_vta_fe', pto_vta_fe.toString());

		const response = await ApiHttp.put<Company>(`${URL}/${company_id}`, {
			company_id: company_id,
			pto_vta_fe: pto_vta_fe,
		});

		return response;
	} catch (error) {
		console.log('🚀 ~ file: company-api.ts:29 ~ updateCompanyPtoVta ~ error:', error);
		throw new Error('hubo un errrrrrrrrrrrrrrrrroooorrrrrrr');
	}
};

/* export const getCompany = async (id: number): Promise<AxiosResponse<CompanyRawData>> => {
	try {
		const response = await ApiHttp.get<CompanyRawData>(URL, { id });

		return response;
	} catch (error) {
		throw new Error();
	}
} */
