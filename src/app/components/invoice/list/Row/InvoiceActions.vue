<template>
	<a-space>
		<InvoicePrinting :data="record" />
		<InvoiceDelete :data="record" />
	</a-space>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import InvoicePrinting from './InvoicePrinting.vue';
import InvoiceDelete from './InvoiceDelete.vue';
type Props = {
	index: number;
	record: InvoiceList;
};

const props = withDefaults(defineProps<Props>(), {
	index: undefined,
});
</script>

<style scoped>
.ant-tooltip-inner {
	background-color: red;
}
</style>
