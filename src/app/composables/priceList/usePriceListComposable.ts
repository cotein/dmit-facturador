import { usePriceListStore } from '@/app/store/price-list/usePriceListStore';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { getPriceList, savePriceList, updatePriceList } from '@/api/priceList/price-list-api';
import type { AxiosResponse } from 'axios';
import type { PriceList } from '@/app/types/PriceList';

const store = usePriceListStore();

const { PriceListGetter, priceListForTransferComponent } = storeToRefs(store);

const { setPriceList, setPriceListTranferData, addPriceListToListPriceList } = store;

const extractPriceList = async (company_id: number) => {
    console.log('🚀 ~ file: usePriceListComposable.ts:17 ~ extractPriceList ~ company_id:', company_id);
    const { data: priceList } = await getPriceList(company_id);

    setPriceList(priceList);
};

export const usePriceListComposable = (company_id: number) => {
    const queryClient = useQueryClient();
    const fetchPriceList = async () => {
        try {
            const { isLoading, data } = await useQuery(['price-list'], async () => await getPriceList(company_id), {
                onSuccess(data: AxiosResponse<PriceList[]>) {
                    setPriceList(data.data);
                    setPriceListTranferData(data.data);
                },
                staleTime: 1000 * 60 * 60,
            });
            return data;
        } catch (error) {
            console.error('Error fetching price list:', error);
            throw error;
        }
    };

    const { mutateAsync, isLoading } = useMutation(savePriceList, {
        onSuccess: async (data) => {
            console.log('🚀 ~ file: usePriceListComposable.ts:26 ~ onSuccess: ~ data:', data?.data);
            message.success('La lista de precios fue ingresada');
            queryClient.setQueryData<PriceList[]>(['price-list'], (oldData) => {
                console.log('🚀 ~ file: usePriceListComposable.ts:41 ~ queryClient.setQueryData ~ oldData:', oldData);
                if (!oldData) {
                    return data?.data;
                }

                return [...oldData.data, data.data];
            });

            const query = await queryClient.getQueryData(['price-list']);
            console.log('🚀 ~ file: usePriceListComposable.ts:49 ~ onSuccess: ~ query:', query);
            setPriceList(query);
            setPriceListTranferData(query);
        },
        onError: async (error, data) => {
            console.log('🚀 ~ file: usePriceListComposable.ts:29 ~ onError: ~ error:', error.message);

            message.error(error.message);
        },
    });

    const { mutateAsync: modifyPriceListAsync, isLoading: modifyPriceListLoading } = useMutation(updatePriceList, {
        onSuccess: async (data) => {
            await extractPriceList(company_id);
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
    };
};
