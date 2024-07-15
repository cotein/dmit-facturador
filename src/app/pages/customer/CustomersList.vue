<template>
    <div>
        <sdPageHeader title="Listado de Clientes" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <CustomerList />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '../../styled';
import CustomerList from '@/app/components/customer/list/CustomerList.vue';
</script>
