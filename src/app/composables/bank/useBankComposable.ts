import { getBanks } from '@/api/bank/bank-api';
import { useQuery } from '@tanstack/vue-query';

import { useBankStore } from '@/app/store/bank/useBankStore';
import { storeToRefs } from 'pinia';

import type { Bank } from '@/app/types/Bank';

export const useBankComposable = () => {
    const { banks, selectedBank } = storeToRefs(useBankStore());

    const fetchBanks = (name: string | null = null) => {
        return useQuery<Bank[]>(
            ['banks', name],
            () => {
                const { data } = getBanks(name ?? null);
                return data;
            },
            {
                cacheTime: -1,
                onSuccess(data: Bank[]) {
                    banks.value = data;
                },
            },
        );
    };

    const getBankById = (id: number) => {
        return banks.value.find((bank) => bank.id === id)?.name ?? '';
    };

    return { fetchBanks, banks, selectedBank, getBankById };
};
