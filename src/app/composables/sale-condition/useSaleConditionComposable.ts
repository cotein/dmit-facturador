import type { AxiosResponse } from 'axios';
import { getSaleConditions } from '@/api/sale-condition/sale-condition-api';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import type { SaleCondition } from '@/app/types/SaleCondition';
import { useSaleConditionStore } from '@/app/store/sale-condition/useSaleConditionStore';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { storeToRefs } from 'pinia';

const { saleConditions } = storeToRefs(useSaleConditionStore());
const { setSaleConditions } = useSaleConditionStore();

export const useSaleConditionComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const queryClient = useQueryClient(); // Obtén el cliente de query

    // Verifica si hay datos en la caché
    const cachedData = queryClient.getQueryData(['sale-conditions']);

    const fetchSaleConditions = () => {
        return useQuery(['sale-conditions'], () => getSaleConditions(CompanyGetter.value.id), {
            onSuccess(data: AxiosResponse<SaleCondition[]>) {
                const { data: SaleCondition } = data;

                setSaleConditions(SaleCondition);
            },
            staleTime: Infinity,
            enabled: !cachedData,
            cacheTime: Infinity,
        });
    };

    return {
        saleConditions,
        fetchSaleConditions,
    };
};
