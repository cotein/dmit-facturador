import { ApiHttp } from '../base-api';
import type { AfipInscription } from '@/types/Afip';

export const apiAfipGetInscriptions = async (): Promise<AfipInscription[]> => {
	const params = new URLSearchParams();

	const { data } = await ApiHttp.get<AfipInscription[]>('/api/afip/inscriptions', { params });

	return data;
};
/* const params = new URLSearchParams();

  params.append('per_page', '10');

  const { data } = await gitHubApi.get<Issue[]>('/issues', { params });
  return data; */
