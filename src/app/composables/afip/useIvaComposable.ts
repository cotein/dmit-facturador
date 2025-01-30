import type { AfipIva } from './../../types/Afip';
import { apiAfipGetIvas } from '@/api/afip/afip-iva';
import { useAfipIvaStore } from '@/app/store/afip/useAfipIvaStore';
import { useQuery } from '@tanstack/vue-query';
import { storeToRefs } from 'pinia';

const { IvasGetter, loaded } = storeToRefs(useAfipIvaStore());
const { setIvasAction } = useAfipIvaStore();

export const useIvaComposable = async () => {
    if (!loaded.value) {
        try {
            const { isLoading, data } = await useQuery(['ivas-cache'], async () => await apiAfipGetIvas(), {
                cacheTime: Infinity,
                onSuccess(data: AfipIva[]) {
                    loaded.value = true;
                    setIvasAction(data);
                },
            });
        } catch (error) {
            console.error('Error loading IVAs:', error);
            throw error;
        }
    }
    return { IvasGetter };
};
