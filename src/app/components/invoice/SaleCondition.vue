<template>
    <a-select
        v-model:value="defaultSaleCondition"
        placeholder="Condición de pago"
        style="width: 100%"
        :default-active-first-option="false"
        :field-names="{ label: 'name', value: 'id' }"
        :options="saleConditions"
        size="large"
    ></a-select>
</template>
<script setup lang="ts">
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useSaleConditionComposable } from '@/app/composables/sale-condition/useSaleConditionComposable';
import type { SaleCondition } from '@/app/types/SaleCondition';
import { ref, computed } from 'vue';

const { invoice } = useInvoiceComposable();

const { saleConditions } = useSaleConditionComposable();

const defaultSaleCondition = computed({
    get() {
        return invoice.value.SaleCondition;
    },
    set(val) {
        console.log('🚀 ~ set ~ val:', val);
        invoice.value.SaleCondition = val;
    },
});

const select = async (_: any, option: SaleCondition) => {
    invoice.value.SaleCondition = option;
};
</script>
