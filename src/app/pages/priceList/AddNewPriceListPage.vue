<template>
    <div>
        <sdPageHeader title="Ingresar Lista de precios" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <AddNewPriceListForm />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '../../styled';
import AddNewPriceListForm from '@/app/components/priceList/AddNewPriceListForm.vue';
</script>
