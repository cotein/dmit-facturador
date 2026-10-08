<template>
    <a-drawer
        title="Registrar pago a cuenta"
        placement="right"
        :width="480"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        @close="close"
    >
        <a-form layout="vertical">
            <a-form-item label="Cliente" required>
                <a-select
                    v-model:value="form.customerId"
                    :options="customerOptions"
                    :filter-option="false"
                    show-search
                    allow-clear
                    placeholder="Buscar cliente"
                    @search="searchCustomers"
                />
            </a-form-item>

            <a-form-item label="Fecha del pago" required>
                <a-date-picker v-model:value="form.date" class="w-100" format="DD/MM/YYYY" />
            </a-form-item>

            <a-form-item label="Importe" required>
                <a-input-number
                    v-model:value="form.amount"
                    class="w-100"
                    :min="0"
                    :precision="2"
                    :step="100"
                    placeholder="0,00"
                />
            </a-form-item>

            <a-form-item label="Medio de pago">
                <a-select
                    v-model:value="form.paymentTypeId"
                    :options="paymentTypeOptions"
                    allow-clear
                    placeholder="Elegí el medio de pago"
                />
            </a-form-item>

            <a-form-item label="Referencia">
                <a-input
                    v-model:value="form.reference"
                    :maxlength="255"
                    placeholder="Número de transferencia, cheque"
                />
            </a-form-item>

            <a-form-item label="Observaciones">
                <a-textarea v-model:value="form.comments" :rows="3" :maxlength="255" />
            </a-form-item>
        </a-form>

        <a-alert
            type="info"
            show-icon
            message="Este pago no se imputa a ningún comprobante: queda a cuenta del cliente."
        />

        <div class="drawer-actions">
            <a-button @click="close">Cancelar</a-button>
            <a-button type="primary" :loading="isCreating" @click="submit">Registrar pago</a-button>
        </div>
    </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { getCustomers } from '@/api/customer/customer-api';
import { getPaymentTypes } from '@/api/payment-type/payment-type-api';
import type { PaymentType } from '@/app/types/PaymentType';
import { useReceiptPaymentsComposable } from '@/app/composables/receipt/useReceiptPaymentsComposable';

type Props = {
    companyId: number | null;
};

const props = withDefaults(defineProps<Props>(), {
    companyId: null,
});

const emit = defineEmits(['saved']);

const { registrarPagoACuenta, isCreating } = useReceiptPaymentsComposable();

const visible = ref(false);

const customerOptions = ref<Array<{ label: string; value: number }>>([]);
const paymentTypeOptions = ref<Array<{ label: string; value: number }>>([]);

const form = ref<{
    customerId: number | null;
    date: any;
    amount: number | null;
    paymentTypeId: number | null;
    reference: string;
    comments: string;
}>({
    customerId: null,
    date: dayjs(),
    amount: null,
    paymentTypeId: null,
    reference: '',
    comments: '',
});

const open = () => {
    visible.value = true;

    form.value = {
        customerId: null,
        date: dayjs(),
        amount: null,
        paymentTypeId: null,
        reference: '',
        comments: '',
    };

    searchCustomers('');
    loadPaymentTypes();
};

const close = () => {
    visible.value = false;
};

const searchCustomers = async (term: string) => {
    if (!props.companyId) {
        return;
    }

    try {
        const response: any = await getCustomers(props.companyId, term);
        const list = response?.data ?? [];

        customerOptions.value = list.map((customer: any) => ({
            label: customer.name + ' ' + (customer.last_name ?? ''),
            value: customer.id,
        }));
    } catch (error) {
        console.log('🚀 ~ searchCustomers ~ error:', error);
    }
};

const loadPaymentTypes = async () => {
    if (!props.companyId) {
        return;
    }

    try {
        const types: any = await getPaymentTypes(props.companyId);

        paymentTypeOptions.value = (types ?? []).map((type: PaymentType) => ({
            label: type.name,
            value: type.id,
        }));
    } catch (error) {
        console.log('🚀 ~ loadPaymentTypes ~ error:', error);
    }
};

const submit = async () => {
    if (!props.companyId) {
        message.error('No se pudo resolver la empresa.');
        return;
    }

    if (!form.value.customerId) {
        message.warning('Elegí el cliente.');
        return;
    }

    if (!form.value.amount || form.value.amount <= 0) {
        message.warning('El importe tiene que ser mayor a cero.');
        return;
    }

    try {
        await registrarPagoACuenta({
            companyId: props.companyId,
            customerId: form.value.customerId,
            amount: form.value.amount,
            document: {
                payment_type_id: form.value.paymentTypeId,
                import: form.value.amount,
                imputation_date: form.value.date.format('YYYY-MM-DD'),
                number: form.value.reference || null,
                comments: form.value.comments || null,
            },
        });

        message.success('Pago registrado a cuenta del cliente.');
        visible.value = false;
        emit('saved');
    } catch (error) {
        message.error('No se pudo registrar el pago.');
        console.log('🚀 ~ submit ~ error:', error);
    }
};

defineExpose({ open });
</script>

<style scoped>
.w-100 {
    width: 100%;
}

.drawer-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
}
</style>
