import type { AfipIva } from './../../types/Afip';
import { apiAfipGetIvas } from '@/api/afip/afip-iva';
import { useAfipIvaStore } from '@/app/store/afip/useAfipIvaStore';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

const { IvasGetter, loaded } = storeToRefs(useAfipIvaStore());
const { setIvasAction } = useAfipIvaStore();

export const useIvaComposable = () => {
    if (!loaded) {
        const { isLoading } = useQuery(['ivas-cache'], () => apiAfipGetIvas(), {
            cacheTime: Infinity,

            onSuccess(data: AfipIva[]) {
                setIvasAction(data);
            },
        });
    }
    return { IvasGetter };
};
