<template>
    <div>
        <sdPageHeader title="Cancelar facturas" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <div>
                <NewReceipt />
            </div>
            <div id="table">
                <tableCancelation />
            </div>
            <div id="table">
                <ResumeOfTotals />
            </div>
        </Main>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Main } from '@/app/components/invoice/product/styled';
import NewReceipt from '@/app/components/receipt/NewReceipt.vue';
import tableCancelation from '@/app/components/receipt/tableCancelation.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';
import { getBanks } from '@/api/bank/bank-api';
import { useBankComposable } from '@/app/composables/bank/useBankComposable';
import ResumeOfTotals from '@/app/components/receipt/ResumeOfTotals.vue';

const { fetchPaymentTypes } = usePaymentTypeComposable();
const { banks } = useBankComposable();

onBeforeMount(async () => {
    const queryClient = useQueryClient();

    const paymentTypesCache = queryClient.getQueryData(['payment-types']);

    if (!paymentTypesCache) {
        await fetchPaymentTypes();
    }
});
</script>

<style scoped>
#table {
    margin-top: 20px;
}
</style>
