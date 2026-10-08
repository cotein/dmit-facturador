<template>
    <div>
        <sdPageHeader title="Pagos recibidos" class="ninjadash-page-header-main"></sdPageHeader>
        <Main>
            <PaymentsReceivedTable />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '@/app/components/invoice/product/styled';
import PaymentsReceivedTable from '@/app/components/receipt/list/PaymentsReceivedTable.vue';
</script>

<style scoped></style>
