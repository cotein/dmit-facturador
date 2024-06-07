<template>
    <div>
        <sdPageHeader title="Ingresar un nuevo Producto" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <FormComponentsWrap>
                <a-row :gutter="20">
                    <a-col :md="24" :xs="24">
                        <sdCards title="Producto" class="mb-25 rounded-card">
                            <AddProduct />
                        </sdCards>
                    </a-col>
                </a-row>
            </FormComponentsWrap>
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '../../styled';
import { FormComponentsWrap } from '@/views/forms/overview/Style';
import AddProduct from '@/app/components/product/new/AddProduct.vue';
</script>
