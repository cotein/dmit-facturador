import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Filtros y paginación de la pantalla de cobros online.
 *
 * Store propio por la misma razón que el de pagos recibidos: si compartiera
 * estado con otra pantalla, mover un filtro acá cambiaría el listado de allá.
 */
export const useMercadoPagoChargesStore = defineStore('mercado-pago-charges', () => {
    const charges = ref<any[]>([]);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(25);
    const totalItems = ref<number>(0);

    const status = ref<string | null>(null);
    const concept = ref<string | null>(null);
    const customerId = ref<number | null>(null);
    const from = ref<string | null>(null);
    const to = ref<string | null>(null);

    const resetFilters = () => {
        status.value = null;
        concept.value = null;
        customerId.value = null;
        from.value = null;
        to.value = null;
        currentPage.value = 1;
    };

    return {
        charges,
        currentPage,
        itemsPerPage,
        totalItems,
        status,
        concept,
        customerId,
        from,
        to,
        resetFilters,
    };
});
