import { getBanks } from '@/api/bank/bank-api';
import { useQuery } from '@tanstack/vue-query';

import { useBankStore } from '@/app/store/bank/useBankStore';
import { storeToRefs } from 'pinia';

import type { Bank } from '@/app/types/Bank';

export const useBankComposable = () => {
    const { banks, selectedBank } = storeToRefs(useBankStore());

    const { isLoading, data } = useQuery<Bank[]>(
        ['banks', name],
        async () => {
            const response = await getBanks(name ?? null);
            return response.data;
        },
        {
            cacheTime: -1,
            onSuccess(data: Bank[]) {
                banks.value = data;
            },
        },
    );

    const getBankById = (id: number) => {
        return banks.value.find((bank) => bank.id === id)?.name ?? '';
    };

    return { isLoading, data, banks, selectedBank, getBankById };
};
