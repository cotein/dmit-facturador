<template>
    <PaymentTypeBase :onSelect="select" />
</template>
<script setup lang="ts">
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import PaymentTypeBase from '@/app/componentsBase/SelectedPaymentTypeBase.vue';
import type { PaymentType } from '@/app/types/PaymentType';
import type { ProductOnInvoiceTable } from '@/app/types/Product';

const { invoice, invoiceTableData } = useInvoiceComposable();

const select = async (_: any, option: PaymentType) => {
    invoice.value.paymentType = option.id;

    invoiceTableData.value.forEach((item: ProductOnInvoiceTable) => {
        item.aditional.percentage = option.percentage;
        item.unit = item.price_base + (item.price_base * option.percentage) / 100;
    });
};
</script>
