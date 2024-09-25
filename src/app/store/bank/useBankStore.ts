import type { Bank } from '@/app/types/Bank';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBankStore = defineStore('banks', () => {
    const banks = ref<Bank[]>([]); //se utiliza para los componentes cascader

    const selectedBank = ref<Bank | null>(null);

    return {
        //State properties
        //Actions
        banks,
        selectedBank,
    };
});
