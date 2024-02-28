<template>
	<a-select
		v-model:value="saleCondition"
		placeholder="Condición de pago"
		style="width: 100%"
		:default-active-first-option="false"
		:field-names="{ label: 'name', value: 'id' }"
		:options="saleConditions"
		size="large"
		@select="select"
	></a-select>
</template>
<script setup lang="ts">
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useSaleConditionComposable } from '@/app/composables/sale-condition/useSaleConditionComposable';
import type { SaleCondition } from '@/app/types/SaleCondition';
import { ref } from 'vue';

const saleCondition = ref(1);

const { invoice } = useInvoiceComposable();
const { saleConditions } = useSaleConditionComposable();

const select = async (_: any, option: SaleCondition) => {
	invoice.value.SaleCondition = option;
};
</script>
