<template>
    <div v-if="totalsDocumetsCancelation.length > 0">
        {{ documentsCancelation }}
        <h1>Resumen de pago</h1>
        <a-list :grid="{ gutter: 16, column: 4 }" :data-source="totalsDocumetsCancelation">
            <template #renderItem="{ item }">
                <a-list-item>
                    <a-card
                        :title="getPaymentTypeName(item.payment_type_id)"
                        :bodyStyle="{
                            padding: '0px',
                            'background-color': 'orange',
                            'text-align': 'center',
                            'font-size': '18px',
                        }"
                    >
                        <p>{{ $filters.formatCurrency(item.total) }}</p>
                    </a-card>
                </a-list-item>
            </template>
        </a-list>
        <div id="to-pay-container">
            <div id="to-pay-info">
                <p>
                    Total comprobantes de ventas:
                    {{ $filters.formatCurrency(totalInvoicedAmountToCancel) }}.--, total importe a pagar por el cliente:
                    {{ $filters.formatCurrency(TotalToPay) }}.--
                </p>
            </div>
            <div id="to-pay-results">
                <p>
                    {{
                        Diff > 0
                            ? `El cliente debe ${$filters.formatCurrency(Diff)}.--`
                            : `El cliente tiene un saldo a favor de ${$filters.formatCurrency(Diff * -1)}.--`
                    }}
                </p>
            </div>
        </div>
        <div id="to-pay-action">
            <a-button :size="'large'" type="primary">Generar recibo de pago</a-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import { useQueryClient } from '@tanstack/vue-query';
import { computed } from 'vue';
const { totalsDocumetsCancelation, totalInvoicedAmountToCancel, documentsCancelation } = useReceiptComposable();

const queryClient = useQueryClient();

const getPaymentTypeName = (paymentTypeId: number) => {
    const paymentTypes = queryClient.getQueryData(['payment-types']) as Array<{
        company_id: number;
        id: number;
        name: string;
        percentage: number;
    }>;
    if (paymentTypes) {
        const paymentType = paymentTypes.find((type) => type.id === paymentTypeId);

        return paymentType ? paymentType.name : 'Unknown';
    }
    return 'Unknown';
};

const TotalToPay = computed(() => {
    return totalsDocumetsCancelation.value.reduce((acc, item) => {
        return acc + item.total;
    }, 0);
});

const Diff = computed(() => {
    return totalInvoicedAmountToCancel.value - TotalToPay.value;
});
</script>

<style scoped>
#to-pay-info,
#to-pay-results {
    display: flex;
    align-items: center;
    font-size: 18px;
    background-color: #c9d2d7;
    padding: 0 1rem;
    width: 70%;
}

#to-pay-info p,
#to-pay-results p {
    padding-top: 1rem;
    margin-right: 1rem;
}
#to-pay-container {
    display: flex;
    justify-content: space-between;
}
#to-pay-results {
    width: 30%;
    justify-content: flex-end;
}

#to-pay-action {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}
</style>
