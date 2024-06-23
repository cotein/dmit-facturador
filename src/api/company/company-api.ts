import type { AxiosResponse } from 'axios';
import { ApiHttp } from '../base-api';
import type { Company, CompanyRawData } from '@/app/types/Company';

const URL = '/api/company';

export const saveCompany = async (company: CompanyRawData): Promise<AxiosResponse<Company[]>> => {
    const response = await ApiHttp.post<Company[]>(URL, { company });

    return response;
};
export const updateCompany = async (company: Company): Promise<AxiosResponse<Company[]>> => {
    const response = await ApiHttp.put<Company[]>(`${URL}/${company.id}`, { company }, { method: 'PUT' });
    return response;
};

export const updateCompanyPtoVta = async (company_id: number, pto_vta_fe: number): Promise<AxiosResponse<Company>> => {
    const params = new URLSearchParams();

    params.append('pto_vta_fe', pto_vta_fe.toString());

    const response = await ApiHttp.put<Company>(`${URL}/${company_id}`, {
        pto_vta_fe: pto_vta_fe,
    });

    return response;
};

/* export const getCompany = async (id: number): Promise<AxiosResponse<CompanyRawData>> => {
	try {
		const response = await ApiHttp.get<CompanyRawData>(URL, { id });

		return response;
	} catch (error) {
		throw new Error();
	}
} */
