import { useQuery } from '@tanstack/vue-query';
import { apiAfipGetInscriptions } from '@/api/afip/afip-inscriptions';
import { useAfipInscriptionsStore } from '@/store/afip/inscriptions-store';
import type { AfipInscription } from '@/types/Afip';

export const useInscriptionsComposable = () => {
	const store = useAfipInscriptionsStore();
	//Con Vue-query
	const { isLoading } = useQuery(['incriptions-cache'], () => apiAfipGetInscriptions(), {
		onSuccess(data: AfipInscription[]) {
			store.setInscriptionsAction(data);
		},
	});
	return { isLoading, store };
};

export default useInscriptionsComposable;
