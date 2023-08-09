import { ApiHttp } from '../base-api';

export const apiEmailVerification = async (url: string): Promise<any> => {
	const response = await ApiHttp.get<any>(url);

	return response;
};
export const apiEmailResendVerification = async (id: any): Promise<any> => {
	const response = await ApiHttp.post<any>(`/email/resend`, {
		id,
	});

	return response;
};
