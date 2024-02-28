<template>
	<div>
		<span class="product-total-price" v-if="$props.record?.voucher.parents.length">
			<a-popover title="Comprobante asociado" trigger="hover">
				<template #content>
					<p v-for="(item, index) in $props.record?.voucher.parents" :key="index" style="margin: 5px 10px">
						{{ item.invoice }}
						<a-button type="primary" style="margin-left: 5px"> Ver </a-button>
					</p>
				</template>
				<span class="product-total-price">
					<a-typography-text type="danger"
						>{{ $props.record?.voucher.name }} {{ props.record.voucher.pto_vta }} -
						{{ props.record.voucher.cbte_desde }}</a-typography-text
					>
				</span>
			</a-popover>
		</span>
		<span class="product-total-price" v-else>
			{{ $props.record?.voucher.name }} {{ props.record.voucher.pto_vta }} - {{ props.record.voucher.cbte_desde }}
		</span>
	</div>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import type { PrinterFilled, PrinterOutlined } from '@ant-design/icons-vue';

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
