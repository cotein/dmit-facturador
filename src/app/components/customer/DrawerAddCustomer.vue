<template>
    <a-button class="config--button" type="primary" @click="openDrawerAddCustomer" :size="sizeButton"
        >Ingresar cliente nuevo</a-button
    >
    <a-drawer :visible="drawerAddCustomerIsVisible" @close="closeDrawerAddCustomer" :width="drawerWidth()">
        <template #title>
            <h2 class="title">Ingresar Cliente</h2>
        </template>
        <template #extra>
            <a-button style="margin-right: 8px" @click="closeDrawerAddCustomer" :size="sizeButton">Cerrar</a-button>
        </template>
        <FormCustomer :should-use-address-rule="false" />
    </a-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import FormCustomer from './FormCustomer.vue';
import { useDrawerAddCustomerStore } from '@/app/store/panels/useDrawerAddCustomerStore';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';

const { drawerAddCustomerIsVisible } = storeToRefs(useDrawerAddCustomerStore());
const { openDrawerAddCustomer, closeDrawerAddCustomer } = useDrawerAddCustomerStore();

const { sizeButton, drawerWidth } = useMediaQueryComposable();
</script>

<style scoped>
.config--button {
    margin: 0 10px;
}
/* Estilos para cambiar el tamaño del título según el dispositivo */
@media (max-width: 768px) {
    .title {
        font-size: 10px; /* Tamaño del título para dispositivos móviles */
    }
}

@media (min-width: 769px) {
    .title {
        font-size: 18px; /* Tamaño del título para dispositivos de escritorio */
    }
}
</style>
