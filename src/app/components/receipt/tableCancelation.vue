<template>
    <div id="total-amount-to-cancel">
        <DocumentCancelationDrawer />
        <div id="to-cancel">
            <p>Total a cancelar:</p>
            <a-tag color="green">{{ TotalInvoicedAmountToCancelComputed }}</a-tag>
        </div>
    </div>
    <div id="descriptions">
        <h3>Detalle de los documentos</h3>
        <div id="description" v-for="(item, index) in documentsCancelation" :key="index">
            <a-descriptions
                :title="index + 1"
                bordered
                :labelStyle="{ color: 'white', 'background-color': 'gray' }"
                size="small"
            >
                <a-descriptions-item label="Pago">{{
                    getPaymentTypeName(item.payment_type_id ?? 1)
                }}</a-descriptions-item>

                <a-descriptions-item v-if="item.number" label="N° pago/transferencia">{{
                    item.number.toUpperCase()
                }}</a-descriptions-item>

                <a-descriptions-item label="Importe">{{ $filters.formatCurrency(item.import) }} </a-descriptions-item>

                <a-descriptions-item v-if="item.ctacte" label="Ingresa a Cta. Corriente">{{
                    item.ctacte?.toUpperCase()
                }}</a-descriptions-item>

                <a-descriptions-item v-if="item.bank" label="Banco">{{
                    getBankById(item.bank ?? 0)
                }}</a-descriptions-item>

                <a-descriptions-item v-if="item.chequeOwner" label="Propietario del cheque">
                    {{ item.chequeOwner?.toUpperCase() }}
                </a-descriptions-item>

                <a-descriptions-item v-if="item.imputation_date" label="Fecha de imputación">{{
                    item.imputation_date
                }}</a-descriptions-item>

                <a-descriptions-item v-if="item.chequeDate" label="Fecha emisión cheque">{{
                    item.chequeDate
                }}</a-descriptions-item>

                <a-descriptions-item v-if="item.chequeExpirate" label="Fecha vencimiento cheque">{{
                    item.chequeExpirate
                }}</a-descriptions-item>

                <a-descriptions-item v-if="item.comments" label="Comentarios " :span="3">
                    {{ item.comments }}
                </a-descriptions-item>

                <a-descriptions-item>
                    <template #label>
                        <a-button @click="documentCancelationEdit(index)">Editar</a-button>
                    </template>
                </a-descriptions-item>
            </a-descriptions>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import DocumentCancelationDrawer from './tableCancelationComponents/DocumentCancelationDrawer.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useBankComposable } from '@/app/composables/bank/useBankComposable';

const { getBankById } = useBankComposable();

const {
    totalInvoicedAmountToCancel,
    documentsCancelation,
    drawerVisible,
    isEditingDocumentCancelation,
    dataDocumentCancelation,
} = useReceiptComposable();

const TotalInvoicedAmountToCancelComputed = computed(() => {
    return formatCurrency(totalInvoicedAmountToCancel.value);
});

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

const documentCancelationEdit = (index: any) => {
    isEditingDocumentCancelation.value = true;
    drawerVisible.value = true;
    dataDocumentCancelation.value = {
        data: documentsCancelation.value[index],
        index: index,
    };
};
</script>

<style lang="less">
.editable-cell {
    position: relative;
    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
        padding-right: 24px;
    }

    .editable-cell-text-wrapper {
        padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
        position: absolute;
        right: 0;
        width: 20px;
        cursor: pointer;
    }

    .editable-cell-icon {
        margin-top: 4px;
        display: none;
    }

    .editable-cell-icon-check {
        line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
        color: #108ee9;
    }

    .editable-add-btn {
        margin-bottom: 8px;
    }
}

.editable-cell:hover .editable-cell-icon {
    display: inline-block;
}

#total-amount-to-cancel {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-right: 2rem;
}
/* Opcional: Asegura que las celdas no se expandan más allá del ancho fijo */
.a-table-cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#to-cancel {
    display: flex;
    align-items: center;
    font-size: 22px;
    background-color: #f1ad46;
    padding: 0 1rem;
    border-radius: 5px;
    border: #f8fbfc solid 1px;
    color: #3d3a3a;
}

#to-cancel p {
    padding-top: 1rem;
    margin-right: 1rem;
}
#descriptions {
    margin-top: 2rem;
    padding: 1rem;
    background-color: #ffffff;
}
#descriptions h3 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
}
#description {
    margin-bottom: 1rem;
}
</style>
