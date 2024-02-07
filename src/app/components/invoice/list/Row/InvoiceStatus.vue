<template>
	<div>
		<a-tag :color="StatusColor">{{ Status }}</a-tag>
	</div>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import { computed } from 'vue';

type Props = {
	record: InvoiceList;
	index: number;
};

const props = withDefaults(defineProps<Props>(), {
	record: undefined,
	index: undefined,
});

const Status = computed(() => {
	switch (props.record.voucher.status) {
		case 1:
			return 'ADEUDA';
		case 2:
			return 'PARCIALMENTE CANCELADA';
		case 3:
			return 'CANCELADA';
		default:
			throw new Error(`No existe este Status`);
	}
});

const StatusColor = computed(() => {
	switch (props.record.voucher.status) {
		case 1:
			return '#e717259f';
		case 2:
			return '#e4e40d94';
		case 3:
			return '#0de42d94';
		default:
			throw new Error(`No existe este Status`);
	}
});
</script>

<style scoped>
div {
	text-align: center;
	width: 100%;
	color: #e4e40d94;
}
</style>
