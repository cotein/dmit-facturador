<template>
    <a-button type="primary" style="margin-left: 5px" @click="printInvoice" :loading="spinner"> Ver </a-button>
</template>

<script setup lang="ts">
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { ref } from 'vue';

const { printPdf } = usePrinterPdfComposable();

type Props = {
    invoice_id: number;
    company_id: number;
};

const props = withDefaults(defineProps<Props>(), {
    invoice_id: undefined,
    company_id: undefined,
});

const spinner = ref<boolean>(false);

const printInvoice = async () => {
    spinner.value = true;

    const invoice = await getInvoiceList(
        props.company_id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        props.invoice_id,
    ).finally(() => (spinner.value = false));

    if (invoice) {
        printPdf(invoice.data[0]);
    }
};
</script>

<style scoped></style>
