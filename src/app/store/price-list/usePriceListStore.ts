import type { PriceList, PriceListTranferData } from '@/app/types/PriceList';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const usePriceListStore = defineStore('price-list', () => {
    const priceList = ref<PriceList[]>([]);

    const priceListForTransferComponent = ref<PriceListTranferData[]>([]);

    const setPriceListTranferData = (list: PriceList[]) => {
        list.map((priceList: PriceList) => {
            priceListForTransferComponent.value.push({
                key: String(priceList.value),
                title: priceList.label ?? '',
                profit_percentage: priceList.profit_percentage,
            });
        });
    };

    const setPriceList = (value: PriceList[]) => {
        priceList.value = value;
    };

    const addPriceListToListPriceList = (value: any) => {
        priceList.value.push(value);
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
