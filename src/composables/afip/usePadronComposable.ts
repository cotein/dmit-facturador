import { apiAfipGetCompanyDataByCuit } from '@/api/afip/afip-padron';
import type { Cuit } from '@/types/User';
import { useQuery } from '@tanstack/vue-query';

export const usePadronComposable = (cuit: any) => {
	const { isLoading, isSuccess, data, isError } = useQuery(['afip-padron'], () => apiAfipGetCompanyDataByCuit(cuit));

	return { isLoading, isSuccess, data, isError };
};
