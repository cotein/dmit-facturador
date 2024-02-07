import type { RegisterUserResponse, RegisterUser, Cuit } from '../../app/types/User';
import { ApiHttp } from '../base-api';
import type { AxiosResponse } from 'axios';

export const apiRegisterUser = async (user: RegisterUser): Promise<AxiosResponse<RegisterUserResponse>> => {
	try {
		const response = await ApiHttp.post<RegisterUserResponse>('/register', { user });

		return response;
	} catch (error) {
		console.log('🚀 ~ file: register-api.ts:11 ~ apiRegisterUser ~ error:', 'error');
		throw error;
	}
};

export const apiRegisterCheckCuit = async (cuit: Cuit): Promise<any> => {
	const response = await ApiHttp.post<any>('/api/register/check-cuit', { cuit });

	return response;
};
