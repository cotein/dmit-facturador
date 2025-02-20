import { PAGINATION_ITEMS_PER_PAGE_50 } from '@/app/types/Constantes';
import type { Customer } from '@/app/types/Invoice';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type IsActiveType = 'active' | 'inactive' | 'all';

export const useCustomerListStore = defineStore('customer-list', () => {
    const customersList = ref<Customer[]>([]);

    const currentPage = ref<number>(1);

    const itemsPerPage = ref<number>(PAGINATION_ITEMS_PER_PAGE_50);

    const totalPages = ref<number>();

    const status = ref<IsActiveType>('all');

    const customerName = ref<string>('');

    return {
        customersList,
        currentPage,
        itemsPerPage,
        totalPages,
        status,
        customerName,
    };
});
