import { apiAfipGetStates } from '@/api/afip/afip-states';
import { useAfipStateStore } from '@/app/store/afip/states-store';
import type { AfipState } from '@/app/types/Afip';
import { useQuery } from '@tanstack/vue-query';

export const useState = () => {
	//defino el store
	const statesStore = useAfipStateStore();

	const { isLoading: statesLoading } = useQuery(['states-cache'], () => apiAfipGetStates(), {
		onSuccess(data: AfipState[]) {
			statesStore.setStatesAction(data);
		},
	});
	return { statesLoading, statesStore };
};
