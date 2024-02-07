import type { AfipState } from '@/app/types/Afip';
import { ApiHttp } from '../base-api';

export const apiAfipGetStates = async (): Promise<AfipState[]> => {
	const params = new URLSearchParams();

	const { data } = await ApiHttp.get<AfipState[]>('/api/afip/states', { params });

	return data;
};
