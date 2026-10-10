<template>
    <div>
        <Main>
            <ConnectMercadoPagoCard />
            <ChargesTable />
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from '@/app/components/invoice/product/styled';
import ConnectMercadoPagoCard from '@/app/components/mercadoPago/ConnectMercadoPagoCard.vue';
import ChargesTable from '@/app/components/mercadoPago/ChargesTable.vue';

/**
 * Cobros online con Mercado Pago: primero el estado de la conexión (sin cuenta
 * conectada no se puede cobrar) y después el listado con sus acciones.
 */
</script>

<style scoped></style>
