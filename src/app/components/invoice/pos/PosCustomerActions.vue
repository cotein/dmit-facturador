<template>
    <div class="pos-customer-actions" role="group" aria-label="Cliente de la venta" data-testid="pos-customer-actions">
        <a-button
            type="primary"
            data-action="open-customer-drawer"
            data-testid="pos-customer-search"
            @click="openDrawerDatosCliente = true"
        >
            <template #icon><SearchOutlined /></template>
            Buscar cliente
        </a-button>

        <a-button data-action="add-customer" data-testid="pos-customer-new" @click="openDrawerAddCustomer()">
            <template #icon><PlusOutlined /></template>
            Nuevo cliente
        </a-button>

        <!--
            El drawer de alta se monta una sola vez, acá, en los dos modos: el botón que
            lo abre es el "Nuevo cliente" de arriba. Antes colgaba de la configuración
            (dentro del panel de venta) y quedaba perdido entre los campos del comprobante.
        -->
        <DrawerAddCustomer :show-trigger="false" />
    </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { storeToRefs } from 'pinia';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import { useDrawerAddCustomerStore } from '@/app/store/panels/useDrawerAddCustomerStore';
import DrawerAddCustomer from '../../customer/DrawerAddCustomer.vue';

/**
 * Las dos acciones de cliente de la pantalla de facturación, arriba de todo.
 *
 * Son las que más se tocan después de la búsqueda de productos —elegir otro cliente o
 * dar de alta uno nuevo— y hasta ahora vivían dentro del bloque de configuración del
 * comprobante, abajo y entre los campos: había que bajar hasta ahí para encontrarlas.
 *
 * Se montan en el layout compartido (`PosLayout`), así que están en el mismo lugar en
 * los dos modos, siempre antes del buscador y del ticket.
 */
const { openDrawerDatosCliente } = useVisibleComposable();
const { openDrawerAddCustomer } = useDrawerAddCustomerStore();
const { drawerAddCustomerIsVisible } = storeToRefs(useDrawerAddCustomerStore());

/**
 * Al cerrar el drawer de alta, el foco no puede quedarse adentro.
 *
 * Ant deja el contenido montado al cerrar: sin esto el foco seguía en un campo ya
 * invisible, lo que se tipeara después caía ahí y el siguiente `Tab` recorría contenido
 * oculto. Vuelve al botón que lo abre. Es el mismo cuidado que ya tenía el drawer de
 * datos del cliente.
 */
watch(drawerAddCustomerIsVisible, (open) => {
    if (open) {
        return;
    }

    nextTick(() => {
        const active = document.activeElement as HTMLElement | null;

        if (!active || !active.closest('.ant-drawer')) {
            return;
        }

        (document.querySelector('[data-action="add-customer"]') as HTMLElement | null)?.focus();
    });
});
</script>
