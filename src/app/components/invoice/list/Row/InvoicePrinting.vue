<template>
	<a class="ant-dropdown-link" @click.prevent="printPdf">
		<PrinterFilled style="color: black" />
		Imprimir comprobante
		<!-- <a-button type="default" @click="printPdf">
			<template #icon>
				<PrinterFilled />
			</template>
			Imprimir comprobante
		</a-button> -->
	</a>
</template>

<script setup lang="ts">
import { PrinterFilled } from '@ant-design/icons-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import type { Invoice } from '@/app/pdf/invoices/Invoice';
import type { InvoiceList } from '@/app/types/Invoice';

const { CompanyGetter } = useCompanyComposable();
const { getPdfInvoice } = usePrinterPdfComposable();

type Props = {
	data: InvoiceList;
};

const props = withDefaults(defineProps<Props>(), {
	data: undefined,
});

const printPdf = () => {
	const invoicePdf = getPdfInvoice(props.data.voucher.voucher_type);

	const pdf = new invoicePdf(
		CompanyGetter.value,
		props.data.customer,
		props.data.voucher,
		props.data.items,
		props.data.comment,
	) as Invoice;

	pdf.print();
};
</script>

<style scoped></style>
