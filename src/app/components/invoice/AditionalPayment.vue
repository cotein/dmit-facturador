<template>
    <div class="aditional--container">
        <span class="sale--condition--info">
            <h3>Condición de venta: {{ SaleConditionInfo }}</h3></span
        >
        <span class="payment--type--info">
            <h3>Tipo de pago: {{ PaymentTypeInfo }}</h3></span
        >
        <span class="payment--type--info" v-if="PaymentTypePercentageInfo > 0">
            <h3>Adicional: {{ PaymentTypePercentageInfo }}%</h3></span
        >
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useSaleConditionComposable } from '@/app/composables/sale-condition/useSaleConditionComposable';
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';

const { invoice } = useInvoiceComposable();
const { saleConditions } = useSaleConditionComposable();
const { PaymentTypesGetter } = usePaymentTypeComposable();

const SaleConditionInfo = computed(() => {
    const saleConditionId = invoice.value.SaleCondition;
    const saleCondition = saleConditions.value.find((pt) => pt.id === saleConditionId);

    return saleCondition ? saleCondition.name : '';
});

const PaymentTypeInfo = computed(() => {
    const paymentTypeId = invoice.value.paymentType;
    const paymentType = PaymentTypesGetter.value.find((pt) => pt.id === paymentTypeId);

    return paymentType ? paymentType.name : '';
});

const PaymentTypePercentageInfo = computed(() => {
    const paymentTypeId = invoice.value.paymentType;
    const paymentType = PaymentTypesGetter.value.find((pt) => pt.id === paymentTypeId);

    return paymentType ? paymentType.percentage : '';
});
</script>

<style scoped>
.aditional--container {
    display: flex;
    flex-wrap: wrap;
}

.aditional--container span {
    flex: 1 1 100%;
}

@media (max-width: 768px) {
    .aditional--container span {
        flex: 1 1 100%;
        font-size: 0.7rem;
    }
}

@media (min-width: 768px) {
    .aditional--container span {
        flex: 1;
    }
}
</style>
