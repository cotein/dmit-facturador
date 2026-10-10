<template>
    <div>
        <sdPageHeader title="Generar comprobante de venta" class="ninjadash-page-header-main"> </sdPageHeader>
        <Main>
            <FormInvoice />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Main } from '../../styled';
import FormInvoice from '../../components/invoice/FormInvoice.vue';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import { useDrawerAddCustomerStore } from '@/app/store/panels/useDrawerAddCustomerStore';

const { openDrawerAddCustomer } = useDrawerAddCustomerStore();
const { openDrawerDatosCliente } = useVisibleComposable();

/**
 * Atajos de cliente de la pantalla.
 *
 * `F12`, `/` y `F2` ya no se manejan acá: el buscador de productos está siempre en
 * pantalla, en los dos modos, y el foco a ese campo lo da el mapa de teclado del
 * layout (`usePosShortcuts`). Antes esta pantalla abría el modal de búsqueda, que
 * era el camino del modo normal; hoy los dos modos usan el buscador inline.
 */
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

/**
 * Antes se registraba un listener anónimo por cada montaje de la pantalla y nunca se
 * quitaba: después de entrar N veces, cada atajo se disparaba N veces.
 */
const onKeydown = (event: KeyboardEvent) => {
    openDrawerCliente(event);
    drawerAddCustomer(event);
};

onMounted(() => {
    window.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown);
});
</script>
