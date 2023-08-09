import type { User } from '@/types/User';
import { ApiHttp } from '../base-api';

export const getuser = async (): Promise<any> => {
	try {
		const response = await ApiHttp.get<User>('http://localhost:8001/api/users');

		return response;
	} catch (error) {
		console.log('🚀 ~ file: login-api.ts:13 ~ Login ~ error:', error);
	}
};
