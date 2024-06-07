<template>
    <a-select
        v-model:value="defaultPaymentType"
        placeholder="Modo de pago"
        style="width: 100%"
        :default-active-first-option="false"
        :field-names="{ label: 'name', value: 'id' }"
        :options="PaymentTypesGetter"
        size="large"
        @select="select"
    ></a-select>
</template>
<script setup lang="ts">
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';
import type { PaymentType } from '@/app/types/PaymentType';
import { ref } from 'vue';

const defaultPaymentType = ref(1);

const { PaymentTypesGetter } = usePaymentTypeComposable();

const { invoice, invoiceTableData } = useInvoiceComposable();

const select = async (_: any, option: PaymentType) => {
    invoice.value.paymentType = option.id;

    invoiceTableData.value.forEach((item: ProductOnInvoiceTable) => {
        item.aditional.percentage = option.percentage;
        item.unit = item.price_base + (item.price_base * option.percentage) / 100;
    });
};
</script>
