<template>
    <TopToolBox>
        <a-row :gutter="15" class="justify-content-center">
            <a-col :xxl="5" :lg="5" :xs="24">
                <a-range-picker
                    v-model:value="dateRange"
                    class="w-100"
                    format="DD/MM/YYYY"
                    :placeholder="['Desde', 'Hasta']"
                    @change="onDateChange"
                />
            </a-col>

            <a-col :xxl="5" :lg="5" :xs="24">
                <a-select
                    v-model:value="selectedCustomer"
                    class="w-100"
                    :options="customerOptions"
                    :filter-option="false"
                    show-search
                    allow-clear
                    placeholder="Cliente"
                    @search="searchCustomers"
                    @change="onCustomerChange"
                />
            </a-col>

            <a-col :xxl="4" :lg="4" :xs="24">
                <a-select
                    v-model:value="selectedPaymentType"
                    class="w-100"
                    :options="paymentTypeOptions"
                    allow-clear
                    placeholder="Medio de pago"
                    @change="onPaymentTypeChange"
                />
            </a-col>

            <a-col :xxl="3" :lg="3" :xs="24">
                <a-select
                    v-model:value="selectedStatus"
                    class="w-100"
                    :options="statusOptions"
                    allow-clear
                    placeholder="Estado"
                    @change="onStatusChange"
                />
            </a-col>

            <a-col :xxl="3" :lg="3" :xs="12">
                <a-input-number
                    v-model:value="localAmountFrom"
                    class="w-100"
                    :min="0"
                    placeholder="Importe desde"
                    @change="onAmountChange"
                />
            </a-col>

            <a-col :xxl="3" :lg="3" :xs="12">
                <a-input-number
                    v-model:value="localAmountTo"
                    class="w-100"
                    :min="0"
                    placeholder="Importe hasta"
                    @change="onAmountChange"
                />
            </a-col>

            <a-col :xxl="1" :lg="1" :xs="24">
                <a-tooltip title="Limpiar filtros">
                    <a-button shape="circle" @click="onClear">
                        <unicon name="redo"></unicon>
                    </a-button>
                </a-tooltip>
            </a-col>
        </a-row>
    </TopToolBox>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import type { Dayjs } from 'dayjs';
import { TopToolBox } from '@/app/components/invoice/Style';
import { usePaymentsReceivedStore } from '@/app/store/receipt/usePaymentsReceivedStore';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { getCustomers } from '@/api/customer/customer-api';
import { getPaymentTypes } from '@/api/payment-type/payment-type-api';
import type { PaymentType } from '@/app/types/PaymentType';

const route = useRoute();
const store = usePaymentsReceivedStore();
const { customerId, paymentTypeId, status, amountFrom, amountTo, currentPage } = storeToRefs(store);

const { CompanyGetter } = useCompanyComposable();

const dateRange = ref<[Dayjs, Dayjs] | null>(null);
const selectedCustomer = ref<number | null>(customerId.value);
const selectedPaymentType = ref<number | null>(paymentTypeId.value);
const selectedStatus = ref<string | null>(status.value);
const localAmountFrom = ref<number | null>(amountFrom.value);
const localAmountTo = ref<number | null>(amountTo.value);

const customerOptions = ref<Array<{ label: string; value: number }>>([]);
const paymentTypeOptions = ref<Array<{ label: string; value: number }>>([]);

const statusOptions = [
    { label: 'A cuenta', value: 'a_cuenta' },
    { label: 'Parcial', value: 'parcial' },
    { label: 'Cancelado', value: 'cancelado' },
    { label: 'Imputado', value: 'imputado' },
    { label: 'Anulado', value: 'anulado' },
    { label: 'No anulados', value: 'activo' },
];

// Cualquier cambio de filtro vuelve a la primera página: si no, se busca en
// una página que puede no existir con el filtro nuevo.
const resetPage = () => {
    currentPage.value = 1;
};

const onDateChange = (values: [Dayjs, Dayjs] | null) => {
    store.from = values?.[0] ? values[0].format('YYYY-MM-DD') : null;
    store.to = values?.[1] ? values[1].format('YYYY-MM-DD') : null;
    resetPage();
};

const onCustomerChange = () => {
    customerId.value = selectedCustomer.value ?? null;
    resetPage();
};

const onPaymentTypeChange = () => {
    paymentTypeId.value = selectedPaymentType.value ?? null;
    resetPage();
};

const onStatusChange = () => {
    status.value = selectedStatus.value ?? null;
    resetPage();
};

const onAmountChange = () => {
    amountFrom.value = localAmountFrom.value ?? null;
    amountTo.value = localAmountTo.value ?? null;
    resetPage();
};

const onClear = () => {
    dateRange.value = null;
    selectedCustomer.value = null;
    selectedPaymentType.value = null;
    selectedStatus.value = null;
    localAmountFrom.value = null;
    localAmountTo.value = null;

    store.resetFilters();
};

const searchCustomers = async (term: string) => {
    const companyId = CompanyGetter.value?.id;

    if (!companyId) {
        return;
    }

    try {
        const response: any = await getCustomers(companyId, term);

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
    const companyId = CompanyGetter.value?.id;

    if (!companyId) {
        return;
    }

    try {
        const types: any = await getPaymentTypes(companyId);

        paymentTypeOptions.value = (types ?? []).map((type: PaymentType) => ({
            label: type.name,
            value: type.id,
        }));
    } catch (error) {
        console.log('🚀 ~ loadPaymentTypes ~ error:', error);
    }
};

onMounted(async () => {
    loadPaymentTypes();
    await searchCustomers('');

    // Acceso desde la ficha del cliente o desde un comprobante: la pantalla
    // puede llegar con el cliente ya elegido en la dirección.
    const customerFromQuery = Number(route.query.customer_id);

    if (customerFromQuery) {
        selectedCustomer.value = customerFromQuery;
        customerId.value = customerFromQuery;

        if (!customerOptions.value.some((option) => option.value === customerFromQuery)) {
            customerOptions.value.unshift({ label: `Cliente #${customerFromQuery}`, value: customerFromQuery });
        }
    }
});
</script>

<style scoped>
.w-100 {
    width: 100%;
}
</style>
