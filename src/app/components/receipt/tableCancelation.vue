<template>
    <a-row :gutter="[15, 15]">
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <DocumentCancelationDrawer />
        </a-col>
        <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
            <TotalCancelationInfo
                :ocData="{
                    id: '1',
                    type: 'primary',
                    icon: 'dollar-alt',
                    total: TotalInvoicedAmountToCancelComputed,
                    suffix: '+',
                    prefix: '',
                    label: 'Total a cancelar',
                }"
            />
        </a-col>
        <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" id="descriptions" v-if="documentsCancelation.length">
            <h3>Documentos de pago</h3>
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

                    <a-descriptions-item label="Importe"
                        >{{ $filters.formatCurrency(item.import) }}
                    </a-descriptions-item>

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
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import DocumentCancelationDrawer from './tableCancelationComponents/DocumentCancelationDrawer.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useBankComposable } from '@/app/composables/bank/useBankComposable';
import TotalCancelationInfo from './TotalCancelationInfo.vue';

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
/* Media Queries for responsiveness */
@media (max-width: 768px) {
    #to-cancel {
        flex-direction: column;
        font-size: 18px;
        padding: 0.5rem;
    }
}

@media (max-width: 480px) {
    #to-cancel {
        font-size: 16px;
        padding: 0.25rem;
    }
    #descriptions {
        margin-top: 1rem;
        padding: 0.5rem;
    }
    #descriptions h3 {
        font-size: 1.2rem;
    }
}
.to-cancel-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-size: 1.2rem;
    color: #343a40;
}

.to-cancel-container p {
    margin: 0;
    font-weight: bold;
}

.to-cancel-container a-tag {
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
}
</style>
