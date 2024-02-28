<template>
	<a-dropdown class="ant-dropdown-content">
		<a class="ant-dropdown-link" @click.prevent> más... </a>
		<template #overlay>
			<a-menu>
				<a-menu-item>
					<InvoicePrinting :data="record" />
				</a-menu-item>
				<a-menu-item
					@click="open('NOTA DE CRÉDITO')"
					v-if="
						(!record.voucher.isNotaCredito && !record.voucher.isNotaDebito) || record.voucher.isNotaDebito
					"
				>
					<DownOutlined style="color: red" /> Generar Nota de Crédito</a-menu-item
				>
				<a-menu-item
					@click="open('NOTA DE DÉDITO')"
					v-if="
						(!record.voucher.isNotaCredito && !record.voucher.isNotaDebito) || record.voucher.isNotaCredito
					"
				>
					<UpOutlined style="color: green" /> Generar Nota de Débito
				</a-menu-item>
			</a-menu>
		</template>
	</a-dropdown>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import InvoicePrinting from './InvoicePrinting.vue';
import InvoiceDelete from './InvoiceDelete.vue';
import DrawerNotaCredito from '../../DrawerNotaCredito.vue';
import { UpOutlined, DownOutlined } from '@ant-design/icons-vue';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';

const { openDrawerNotaCredito, invoiceForNotaCredito, titleNotaCredito } = useInvoiceNotaCreditoComposable();

type Props = {
	index: number;
	record: InvoiceList;
};
const handleButtonClick = () => {};
const handleMenuClick = () => {};
const props = withDefaults(defineProps<Props>(), {
	index: undefined,
});

const open = (name: string) => {
	titleNotaCredito.value = name;
	openDrawerNotaCredito.value = true;
	invoiceForNotaCredito.value = props.record;
};
</script>

<style scoped>
div ul li span a {
	padding: 0px !important;
}
</style>
