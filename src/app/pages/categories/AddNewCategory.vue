<template>
    <div>
        <sdPageHeader title="Ingresar Categoría" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <AddFatherCategory />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '../../styled';
import AddFatherCategory from '@/app/components/category/AddFatherCategory.vue';
</script>
