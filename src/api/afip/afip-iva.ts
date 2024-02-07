import type { AfipIva } from '@/app/types/Afip';
import { ApiHttp } from '../base-api';

export const apiAfipGetIvas = async (): Promise<AfipIva[]> => {
	const { data } = await ApiHttp.get<AfipIva[]>('/api/afip/ivas');

	return data;
};
