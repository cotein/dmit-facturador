import { apiAfipGetStates } from '@/api/afip/afip-states';
import { useAfipStateStore } from '@/app/store/afip/states-store';
import type { AfipState } from '@/app/types/Afip';
import { useQuery, useQueryClient } from '@tanstack/vue-query';

export const useState = () => {
    //defino el store
    const statesStore = useAfipStateStore();

    const queryClient = useQueryClient(); // Obtén el cliente de query

    // Verifica si hay datos en la caché
    const cachedData = queryClient.getQueryData(['states-cache']);

    const { isLoading: statesLoading } = useQuery(['states-cache'], () => apiAfipGetStates(), {
        onSuccess(data: AfipState[]) {
            statesStore.setStatesAction(data);
        },
        enabled: !cachedData,
        staleTime: Infinity,
        cacheTime: Infinity,
    });
    return { statesLoading, statesStore };
};
