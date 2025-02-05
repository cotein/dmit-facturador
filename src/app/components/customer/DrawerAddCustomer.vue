<template>
    <a-button class="config--button" type="primary" @click="openDrawerAddCustomer">Ingresar cliente nuevo</a-button>
    <a-drawer
        title="Ingresar Cliente "
        :visible="drawerAddCustomerIsVisible"
        @close="closeDrawerAddCustomer"
        :width="drawerWidth"
    >
        <template #extra>
            <a-button style="margin-right: 8px" @click="closeDrawerAddCustomer">Cerrar</a-button>
        </template>
        <FormCustomer :should-use-address-rule="false" />
    </a-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import FormCustomer from './FormCustomer.vue';
import { useDrawerAddCustomerStore } from '@/app/store/panels/useDrawerAddCustomerStore';
import { isMobile } from '@/app/helpers/isMobile';

const { drawerAddCustomerIsVisible } = storeToRefs(useDrawerAddCustomerStore());
const { openDrawerAddCustomer, closeDrawerAddCustomer } = useDrawerAddCustomerStore();

const drawerWidth = isMobile ? '80%' : '75%';
</script>

<style scoped>
.config--button {
    margin: 0 10px;
}
</style>
