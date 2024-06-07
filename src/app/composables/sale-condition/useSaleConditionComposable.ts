import type { AxiosResponse } from 'axios';
import { getSaleConditions } from '@/api/sale-condition/sale-condition-api';
import { useQuery } from '@tanstack/vue-query';
import type { SaleCondition } from '@/app/types/SaleCondition';
import { useSaleConditionStore } from '@/app/store/sale-condition/useSaleConditionStore';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { storeToRefs } from 'pinia';

const { saleConditions } = storeToRefs(useSaleConditionStore());
const { setSaleConditions } = useSaleConditionStore();

export const useSaleConditionComposable = () => {
    const { CompanyGetter } = useCompanyComposable();

    const fetchSaleConditions = () => {
        return useQuery(['sale-conditions'], () => getSaleConditions(CompanyGetter.value.id), {
            onSuccess(data: AxiosResponse<SaleCondition[]>) {
                const { data: SaleCondition } = data;

                setSaleConditions(SaleCondition);
            },
            staleTime: 1000 * 60 * 60,
        });
    };

    return {
        saleConditions,
        fetchSaleConditions,
    };
};
