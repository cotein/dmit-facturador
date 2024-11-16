<template>
    <a-select
        ref="saleConditionSelect"
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
import { ref, computed, nextTick, onMounted } from 'vue';
import type { ComponentPublicInstance } from 'vue';

const { invoice } = useInvoiceComposable();

const { saleConditions } = useSaleConditionComposable();

const saleConditionSelect = ref<ComponentPublicInstance | null>(null);

const defaultSaleCondition = computed({
    get() {
        return invoice.value.SaleCondition;
    },
    set(val) {
        invoice.value.SaleCondition = val;
    },
});

const select = async (_: any, option: SaleCondition) => {
    invoice.value.SaleCondition = option;
};

onMounted(() => {});
</script>
<style scoped>
.focus-red-background {
    background-color: red !important;
}
</style>
