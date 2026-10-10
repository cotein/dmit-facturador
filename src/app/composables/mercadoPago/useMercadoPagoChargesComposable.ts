import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useCompanyComposable } from '../company/useCompanyComposable';
import { useMercadoPagoChargesStore } from '@/app/store/mercadoPago/useMercadoPagoChargesStore';
import {
    cancelCharge,
    createCharge,
    disconnectMercadoPago,
    getCharges,
    getMercadoPagoAccount,
    getMercadoPagoConnectUrl,
    refreshCharge,
} from '@/api/mercado-pago/mercado-pago-api';
import type { CreateChargePayload } from '@/api/mercado-pago/mercado-pago-api';

/**
 * Cobros online: listado, alta del link, anulación y revalidación contra MP.
 *
 * El estado de la conexión se consulta aparte porque la pantalla no se puede
 * usar sin cuenta conectada: es lo primero que se muestra.
 */
export const useMercadoPagoChargesComposable = () => {
    const { CompanyGetter } = useCompanyComposable();
    const queryClient = useQueryClient();

    const store = useMercadoPagoChargesStore();
    const { charges, currentPage, itemsPerPage, totalItems, status, concept, customerId, from, to } =
        storeToRefs(store);

    const accountQuery = useQuery(['mercado-pago-account', CompanyGetter], async () => {
        if (!CompanyGetter.value?.id) {
            return null;
        }

        const response = await getMercadoPagoAccount();

        return response.data?.data ?? null;
    });

    const chargesQuery = useQuery(
        ['mercado-pago-charges', CompanyGetter, currentPage, itemsPerPage, status, concept, customerId, from, to],
        async () => {
            if (!CompanyGetter.value?.id) {
                return null;
            }

            return await getCharges({
                status: status.value,
                concept: concept.value,
                customer_id: customerId.value,
                from: from.value,
                to: to.value,
                page: currentPage.value,
                per_page: itemsPerPage.value,
            });
        },
        { keepPreviousData: true },
    );

    // La API devuelve las filas y la paginación juntas: se copian al store para
    // que la tabla y el paginador lean de un solo lugar.
    watch(
        () => chargesQuery.data.value,
        (response: any) => {
            const cuerpo = response?.data;

            if (!cuerpo) {
                charges.value = [];
                totalItems.value = 0;

                return;
            }

            charges.value = cuerpo.data ?? [];

            const pagination = cuerpo.pagination ?? cuerpo.meta?.pagination;

            if (pagination) {
                currentPage.value = pagination.current_page ?? currentPage.value;
                itemsPerPage.value = pagination.per_page ?? itemsPerPage.value;
                totalItems.value = pagination.total ?? charges.value.length;
            } else {
                totalItems.value = charges.value.length;
            }
        },
    );

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['mercado-pago-charges'] });
        queryClient.invalidateQueries({ queryKey: ['mercado-pago-account'] });
    };

    const createMutation = useMutation(async (payload: CreateChargePayload) => await createCharge(payload), {
        onSuccess: () => invalidate(),
    });

    const cancelMutation = useMutation(async (id: number) => await cancelCharge(id), {
        onSuccess: () => invalidate(),
    });

    /** "Chequear ahora": le pregunta a MP el estado real de este cobro. */
    const refreshMutation = useMutation(async (id: number) => await refreshCharge(id), {
        onSuccess: () => invalidate(),
    });

    const disconnectMutation = useMutation(async () => await disconnectMercadoPago(), {
        onSuccess: () => invalidate(),
    });

    /**
     * Conectar la cuenta: se pide la URL firmada al backend y se navega. El
     * `state` lo valida el callback, así que acá no se manda company_id.
     */
    const connect = async () => {
        const response = await getMercadoPagoConnectUrl();
        const url = response.data?.url;

        if (url) {
            window.location.href = url;
        }
    };

    return {
        accountQuery,
        chargesQuery,
        createMutation,
        cancelMutation,
        refreshMutation,
        disconnectMutation,
        connect,
        charges,
        currentPage,
        itemsPerPage,
        totalItems,
        status,
        concept,
        customerId,
        from,
        to,
    };
};
