import type { CustomerSelectComponent } from '@/app/types/Customer';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFilterSearchByCustomerStore = defineStore('filter-search-by-customer', () => {
    const customer = ref<CustomerSelectComponent>();

    return {
        //State properties
        customer,
    };
});
