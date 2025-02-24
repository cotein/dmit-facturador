import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { apiAfipGetInscriptions } from '@/api/afip/afip-inscriptions';
import { useAfipInscriptionsStore } from '@/app/store/afip/inscriptions-store';
import type { AfipInscription } from '@/app/types/Afip';

export const useInscriptionsComposable = () => {
    const store = useAfipInscriptionsStore();

    const queryClient = useQueryClient(); // Obtén el cliente de query

    // Verifica si hay datos en la caché
    const cachedData = queryClient.getQueryData(['incriptions-cache']);

    //Con Vue-query
    const { isLoading } = useQuery(['incriptions-cache'], () => apiAfipGetInscriptions(), {
        onSuccess(data: AfipInscription[]) {
            store.setInscriptionsAction(data);
        },
        enabled: !cachedData,
        cacheTime: Infinity,
        staleTime: Infinity,
    });
    return { isLoading, store };
};
