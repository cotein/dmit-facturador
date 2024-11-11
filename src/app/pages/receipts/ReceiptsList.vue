<template>
    <div>
        <sdPageHeader title="Listado de Recibos" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <ReceiptTable :loading="isLoading" />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { Main } from '@/app/components/invoice/product/styled';
import { useQueryClient } from '@tanstack/vue-query';
import ReceiptTable from '@/app/components/receipt/list/ReceipTable.vue';
import { useReceiptListComposable } from '@/app/composables/receipt/useReceiptListComposable';

const { isLoading } = useReceiptListComposable();

onBeforeMount(async () => {
    const queryClient = useQueryClient();

    const receiptsInCache = queryClient.getQueryData(['receipt-list']);

    if (!receiptsInCache) {
        useReceiptListComposable();
    }
});
</script>

<style scoped></style>
