<template>
	<a class="ant-dropdown-link" @click.prevent="Pdf">
		<PrinterFilled style="color: black" />
		Imprimir comprobante
	</a>
</template>

<script setup lang="ts">
import { PrinterFilled } from '@ant-design/icons-vue';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import type { InvoiceList } from '@/app/types/Invoice';

const { printPdf } = usePrinterPdfComposable();

type Props = {
	data: InvoiceList;
};

const props = withDefaults(defineProps<Props>(), {
	data: undefined,
});

const Pdf = () => {
	printPdf(props.data);
};
</script>

<style scoped></style>
