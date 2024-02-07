<template>
	<div>
		<span class="product-total-price">
			{{ $props.record?.voucher.name }} {{ props.record.voucher.pto_vta }} - {{ props.record.voucher.cbte_desde }}
		</span>
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
	text-align: right;
	width: 100%;
}
</style>
