<template>
    <div>
        <sdPageHeader title="Generar comprobante de venta" class="ninjadash-page-header-main"> </sdPageHeader>
        <ModalSearchProduct />
        <Main>
            <FormInvoice />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { Main } from '../../styled';
import FormInvoice from '../../components/invoice/FormInvoice.vue';
import ModalSearchProduct from '@/app/components/invoice/ModalSearchProduct.vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import { useDrawerAddCustomerStore } from '@/app/store/panels/useDrawerAddCustomerStore';

const { openDrawerAddCustomer } = useDrawerAddCustomerStore();
const { openDrawerDatosCliente } = useVisibleComposable();
const { openSearchProduct } = useInvoiceComposable();

const openModal = (event: KeyboardEvent) => {
    if (event.code === 'F12') {
        event.preventDefault();
        openSearchProduct.value = true;
    }
};

const openDrawerCliente = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === 'F11') {
        event.preventDefault();
        openDrawerDatosCliente.value = true;
    }
};

const drawerAddCustomer = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === 'F10') {
        event.preventDefault();
        openDrawerAddCustomer();
    }
};

onMounted(() => {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
        openModal(event);
        openDrawerCliente(event);
        drawerAddCustomer(event);
    });
});
</script>
