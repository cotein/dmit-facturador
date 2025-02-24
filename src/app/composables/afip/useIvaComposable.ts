import type { AfipIva } from './../../types/Afip';
import { apiAfipGetIvas } from '@/api/afip/afip-iva';
import { useAfipIvaStore } from '@/app/store/afip/useAfipIvaStore';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

const { IvasGetter, loaded } = storeToRefs(useAfipIvaStore());
const { setIvasAction } = useAfipIvaStore();

export const useIvaComposable = async () => {
    const queryClient = useQueryClient(); // Obtén el cliente de query

    // Verifica si hay datos en la caché
    const cachedData = queryClient.getQueryData(['ivas-cache']);

    const { isLoading, data } = await useQuery(['ivas-cache'], async () => await apiAfipGetIvas(), {
        enabled: cachedData ? true : false,
        cacheTime: Infinity,
        staleTime: Infinity,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        onSuccess(data: AfipIva[]) {
            loaded.value = true;
            setIvasAction(data);
        },
    });

    return { IvasGetter };
};
