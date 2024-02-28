<template>
	<div>
		<span class="product-total-price">{{ props.record.voucher.cbte_fch }}</span>
	</div>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';

type Props = {
	record: InvoiceList;
	index: number;
};

const props = withDefaults(defineProps<Props>(), {
	record: undefined,
	index: undefined,
});
</script>

<style scoped>
div {
	text-align: center;
	width: 100%;
}
</style>
