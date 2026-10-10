<template>
    <div class="mp-filters">
        <a-select
            v-model:value="status"
            class="mp-filter-item"
            placeholder="Estado"
            allow-clear
            :options="statusOptions"
        />
        <a-select
            v-model:value="concept"
            class="mp-filter-item"
            placeholder="Concepto"
            allow-clear
            :options="conceptOptions"
        />
        <a-range-picker
            v-model:value="range"
            class="mp-filter-item"
            value-format="YYYY-MM-DD"
            :placeholder="['Desde', 'Hasta']"
        />
        <a-button @click="onReset">Limpiar</a-button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMercadoPagoChargesStore } from '@/app/store/mercadoPago/useMercadoPagoChargesStore';

/**
 * Filtros del listado de cobros online. El estado y el concepto salen de las
 * mismas etiquetas que usa la tabla, para que no se desincronicen.
 */
const store = useMercadoPagoChargesStore();
const { status, concept, from, to } = storeToRefs(store);

const statusOptions = [
    { value: 'pending', label: 'Pendiente de pago' },
    { value: 'in_process', label: 'En proceso' },
    { value: 'approved', label: 'Pagado' },
    { value: 'rejected', label: 'Rechazado' },
    { value: 'cancelled', label: 'Anulado' },
    { value: 'refunded', label: 'Devuelto' },
];

const conceptOptions = [
    { value: 'invoice', label: 'Comprobante' },
    { value: 'current_account', label: 'Cuenta corriente' },
    { value: 'sale', label: 'Venta' },
    { value: 'manual', label: 'Cobro manual' },
];

// El rango se maneja como par de fechas en el store (from/to), que es lo que
// espera la API; acá se traduce a lo que entiende el selector.
const range = computed({
    get: () => [from.value, to.value] as any,
    set: (value: any) => {
        from.value = value?.[0] ?? null;
        to.value = value?.[1] ?? null;
        store.currentPage = 1;
    },
});

const onReset = () => {
    store.resetFilters();
};
</script>

<style scoped>
.mp-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.mp-filter-item {
    min-width: 180px;
}
</style>
