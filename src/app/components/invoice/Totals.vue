<template>
    <a-row justify="end" class="no-padding-margin">
        <a-col :xxl="6" :xl="6">
            <div class="switch-open-editor">
                <!-- <a-switch
					v-model:checked="openEditor"
					checked-children="Quitar comentarios"
					un-checked-children="Agregar comentarios"
				/> -->
            </div>

            <div class="comments">
                <!-- <quill-editor
					theme="snow"
					placeholder="Ingresar descripción"
					style="height: 10rem"
					v-model:content="invoice.comments"
					contentType="html"
				></quill-editor> -->
            </div>
        </a-col>
        <a-col :xxl="6" :xl="5" :sm="8" :xs="14">
            <OrderSummary>
                <div class="invoice-summary-inner">
                    <ul class="summary-list">
                        <li>
                            <span class="summary-list-title">Subtotal :</span>
                            <span class="summary-list-text">{{ $filters.formatCurrency(Subtotal) }}</span>
                        </li>
                        <li>
                            <span class="summary-list-title">Descuentos :</span>
                            <span class="summary-list-text">{{ $filters.formatCurrency(Discount) }}</span>
                        </li>
                        <template v-for="(iva, index) in IVAS" :key="index">
                            <li>
                                <span class="summary-list-title">Iva: {{ iva.name }}</span>
                                <span class="summary-list-text">{{ $filters.formatCurrency(iva.import) }}</span>
                            </li>
                        </template>
                        <template v-if="PercepIVATresPorciento > 0">
                            <li>
                                <span class="summary-list-title">Perc. IVA 3%</span>
                                <span class="summary-list-text">{{
                                    $filters.formatCurrency(PercepIVATresPorciento)
                                }}</span>
                            </li>
                        </template>
                        <template v-if="PercepIVAUnoComaCinco > 0">
                            <li>
                                <span class="summary-list-title">Perc. IVA 1.5%</span>
                                <span class="summary-list-text">{{
                                    $filters.formatCurrency(PercepIVAUnoComaCinco)
                                }}</span>
                            </li>
                        </template>
                        <template v-if="CompanyGetter?.perception_iibb && PercepIIBB > 0">
                            <li>
                                <span class="summary-list-title">Perc. IIBB {{ alicuotaPercepcion }} %</span>
                                <span class="summary-list-text">{{ $filters.formatCurrency(PercepIIBB) }}</span>
                            </li>
                        </template>
                    </ul>
                    <sdHeading class="summary-total" as="h4">
                        <span class="summary-total-label">Total : </span>
                        <span class="summary-total-amount">{{ $filters.formatCurrency(TotalComprobante) }}</span>
                    </sdHeading>
                </div>
            </OrderSummary>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { OrderSummary } from './Style';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useArbaComposable } from '@/app/composables/arba/useArbaComposable';

const { CompanyGetter } = useCompanyComposable();

const {
    invoice,
    Subtotal,
    Discount,
    TotalComprobante,
    IVAS,
    PercepIVATresPorciento,
    PercepIVAUnoComaCinco,
    PercepIIBB,
} = useInvoiceComposable();

const { alicuotaPercepcion } = useArbaComposable();

const { PaymentTypesGetter } = usePaymentTypeComposable();

const openEditor = ref<boolean>(false);

const Aditional = computed(() => {
    if (Subtotal.value > 0) {
        const paymentTypeId = invoice.value.paymentType;
        const paymentType = PaymentTypesGetter.value.find((pt) => pt.id === paymentTypeId);
        return (Subtotal.value * paymentType.percentage) / 100;
    }
    return 0;
});

const AditionalPercentage = computed(() => {
    const paymentTypeId = invoice.value.paymentType;
    const paymentType = PaymentTypesGetter.value.find((pt) => pt.id === paymentTypeId);
    return `${paymentType.percentage}%:`;
});

watch(openEditor, (value) => {
    if (!value) {
        invoice.value.comments = null;
    }
});
</script>

<style scoped>
.comments {
    padding: 2rem;
}
.switch-open-editor {
    padding: 15px;
}
.no-padding-margin {
    padding-right: 0 !important;
    margin-right: 0 !important;
}
</style>
