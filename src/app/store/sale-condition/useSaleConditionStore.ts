import type { SaleCondition } from '@/app/types/SaleCondition';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSaleConditionStore = defineStore('sale-condition', () => {
    const saleConditions = ref<SaleCondition[]>([]);

    const setSaleConditions = (value: SaleCondition[]) => {
        saleConditions.value = value;
    };

    return {
        saleConditions,
        setSaleConditions,
    };
});
