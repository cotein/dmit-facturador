import { usePriceListStore } from '@/app/store/price-list/usePriceListStore';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { getPriceList, savePriceList, updatePriceList } from '@/api/priceList/price-list-api';

const store = usePriceListStore();

const { PriceListGetter, priceListForTransferComponent } = storeToRefs(store);

const { setPriceList, setPriceListTranferData, addPriceListToListPriceList } = store;

export const usePriceListComposable = (company_id: number) => {
    const queryClient = useQueryClient();

    /**
     * Relee el listado desde la API y deja el store y el cache en el mismo
     * estado. Se resuelve de forma imperativa (sin `useQuery`) para que
     * funcione igual desde un handler o desde un hook de ciclo de vida.
     */
    const fetchPriceList = async () => {
        try {
            const { data } = await getPriceList(company_id);

            setPriceList(data);
            setPriceListTranferData(data);
            queryClient.setQueryData(['price-list'], data);

            return data;
        } catch (error) {
            console.log('🚀 ~ usePriceListComposable ~ fetchPriceList ~ error:', error);
            throw error;
        }
    };

    const { mutateAsync, isLoading } = useMutation(savePriceList, {
        onSuccess: async () => {
            message.success('La lista de precios fue creada.');
            await fetchPriceList();
        },
        onError: async (error) => {
            console.log('🚀 ~ usePriceListComposable ~ onError:', error instanceof Error ? error.message : error);
        },
    });

    const { mutateAsync: modifyPriceListAsync, isLoading: modifyPriceListLoading } = useMutation(updatePriceList, {
        onSuccess: async () => {
            await fetchPriceList();
        },
        onError: async (error) => {
            console.log('🚀 ~ usePriceListComposable ~ onError:', error instanceof Error ? error.message : error);
        },
    });

    return {
        PriceListGetter,
        fetchPriceList,
        setPriceList,
        mutateAsync,
        isLoading,
        modifyPriceListAsync,
        modifyPriceListLoading,
        priceListForTransferComponent,
        addPriceListToListPriceList,
    };
};
