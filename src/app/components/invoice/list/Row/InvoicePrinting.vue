<template>
	<a-tooltip title="Editar">
		<a-button type="default" @click="printPdf">
			<template #icon>
				<PrinterFilled />
			</template>
		</a-button>
	</a-tooltip>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import { PrinterFilled } from '@ant-design/icons-vue';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { Invoice } from '@/app/pdf/invoices/Invoice';

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

<style scoped>
.ant-tooltip-inner {
	background-color: red;
}
</style>
