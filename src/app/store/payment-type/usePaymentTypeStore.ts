import type { PaymentType } from '@/app/types/PaymentType';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePaymentTypeStore = defineStore('payment-type', () => {
    const paymentTypes = ref<PaymentType[]>([]);

    return {
        //State properties
        paymentTypes,
        //Actions
        //Getters
        PaymentTypesGetter: computed(() => paymentTypes.value),
    };
});
