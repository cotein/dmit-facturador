import type { PriceList, PriceListTranferData } from '@/app/types/PriceList';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePriceListStore = defineStore('price-list', () => {
    const priceList = ref<PriceList[]>([]);

    const priceListForTransferComponent = ref<PriceListTranferData[]>([]);

    /**
     * Reemplaza el array completo en cada carga: acumular con push duplicaba
     * todas las listas cada vez que se volvía a pedir el listado.
     */
    const setPriceListTranferData = (list: PriceList[]) => {
        priceListForTransferComponent.value = (list ?? []).map((priceList: PriceList) => ({
            key: String(priceList.value),
            title: priceList.label ?? '',
            profit_percentage: priceList.profit_percentage,
        }));
    };

    const setPriceList = (value: PriceList[]) => {
        priceList.value = value;
    };

    const addPriceListToListPriceList = (value: PriceList) => {
        priceList.value = [...priceList.value, value];
    };

    return {
        //State properties
        //Actions
        setPriceList,
        setPriceListTranferData,
        priceListForTransferComponent,
        addPriceListToListPriceList,
        //Getters
        PriceListGetter: computed(() => priceList.value),
    };
});
