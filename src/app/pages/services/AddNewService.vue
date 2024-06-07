<template>
    <div>
        <sdPageHeader title="Ingresar un nuevo Servicio" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <FormComponentsWrap>
                <a-row :gutter="20">
                    <a-col :md="24" :xs="24">
                        <sdCards title="Producto" class="mb-25 rounded-card">
                            <AddService />
                        </sdCards>
                    </a-col>
                </a-row>
            </FormComponentsWrap>
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '@/app/styled';
import { FormComponentsWrap } from '@/views/forms/overview/Style';
import AddService from '@/app/components/service/AddService.vue';
</script>
