<template>
    <div>
        <sdPageHeader title="Listado de comprobantes de venta" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <InvoiceTable :list="invoiceList" :loading="isLoading" />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '@/app/components/invoice/product/styled';
import { useInvoiceListComposable } from '@/app/composables/invoice/useInvoiceListComposable';
import InvoiceTable from '@/app/components/invoice/list/InvoiceTable.vue';

const { invoiceList, isLoading } = useInvoiceListComposable();
</script>
