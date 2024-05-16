<template>
	<div>
		<span
			v-if="invoice.customer.afip_inscription.id === AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO"
			class="product-total-price"
			>{{ $filters.formatCurrency(props.record.unit) }}</span
		>
		<span v-else class="product-unit">{{ $filters.formatCurrency(props.record.unit) }}</span>
	</div>
</template>

<script setup lang="ts">
import type { ProductOnInvoiceTable } from '@/app/types/Product';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { AFIP_INSCRIPTION } from '@/app/types/Constantes';

const { invoice } = useInvoiceComposable();

type Props = {
	record: ProductOnInvoiceTable;
	index: number;
};

const props = withDefaults(defineProps<Props>(), {
	record: undefined,
	index: undefined,
});
</script>

<style scoped>
div {
	text-align: right;
	width: 100%;
}
</style>
