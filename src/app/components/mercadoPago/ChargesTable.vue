<template>
    <div class="full-width-table">
        <Cards>
            <template #title>
                <div class="mp-table-header">
                    <span>Cobros online</span>
                    <a-space>
                        <a-tooltip
                            title="Revisa en Mercado Pago los cobros pendientes por si alguna notificación no llegó"
                        >
                            <a-button :loading="reconciling" @click="onReconcile">
                                <unicon name="sync"></unicon>
                                Conciliar
                            </a-button>
                        </a-tooltip>
                        <a-button type="primary" :disabled="!canCreate" @click="showNewCharge = true">
                            <unicon name="plus-circle"></unicon>
                            Nuevo cobro
                        </a-button>
                    </a-space>
                </div>
            </template>

            <ChargesFilters />

            <TableDefaultStyle class="ninjadash-having-header-bg">
                <div class="table-bordered top-seller-table table-responsive">
                    <a-table
                        :columns="columns"
                        :loading="isLoading"
                        :dataSource="rows"
                        :pagination="false"
                        row-key="id"
                        :showSorterTooltip="{ title: 'Clic para ordenar' }"
                    >
                        <template #headerCell="{ title }">
                            <div style="text-align: center">{{ title }}</div>
                        </template>

                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.key === 'row'">
                                <RowNumber :index="index" />
                            </template>

                            <template v-if="column.key === 'customer'">
                                {{ record.customer?.name ?? 'Sin cliente' }}
                            </template>

                            <template v-if="column.key === 'concept'">
                                {{ conceptLabel(record.concept) }}
                            </template>

                            <template v-if="column.key === 'created'">
                                {{ record.created_at ? $filters.argentinianDate(record.created_at) : '-' }}
                            </template>

                            <template v-if="column.key === 'amount'">
                                {{ $filters.formatCurrency(record.amount) }}
                            </template>

                            <template v-if="column.key === 'status'">
                                <a-tooltip :title="record.status_detail || statusLabel(record.status)">
                                    <a-tag :color="statusColor(record.status)">{{ statusLabel(record.status) }}</a-tag>
                                </a-tooltip>

                                <!-- Devolución sobre un pago ya imputado: hay que mirarlo a mano. -->
                                <a-tooltip v-if="record.needs_review" :title="record.needs_review.note">
                                    <a-tag class="mp-review-tag" color="volcano">Revisar</a-tag>
                                </a-tooltip>
                            </template>

                            <template v-if="column.key === 'paid_at'">
                                <span v-if="record.paid_at">{{ $filters.argentinianDate(record.paid_at) }}</span>
                                <span v-else>-</span>
                            </template>

                            <template v-if="column.key === 'actions'">
                                <a-space>
                                    <a-tooltip title="Copiar el link para pegar donde quieras">
                                        <a-button type="link" :disabled="!record.share_url" @click="copyLink(record)">
                                            Copiar link
                                        </a-button>
                                    </a-tooltip>

                                    <a-tooltip title="Compartir por WhatsApp">
                                        <a-button
                                            type="link"
                                            :disabled="!record.share_url"
                                            @click="shareWhatsapp(record)"
                                        >
                                            WhatsApp
                                        </a-button>
                                    </a-tooltip>

                                    <a-tooltip title="Enviar por mail">
                                        <a-button type="link" :disabled="!record.share_url" @click="shareMail(record)">
                                            Mail
                                        </a-button>
                                    </a-tooltip>

                                    <a-tooltip
                                        v-if="!isPaid(record) && record.status !== 'cancelled'"
                                        title="Mandar el cobro a la terminal Point del mostrador"
                                    >
                                        <a-button type="link" @click="openPoint(record)">Terminal</a-button>
                                    </a-tooltip>

                                    <a-tooltip
                                        v-if="!isPaid(record) && record.status !== 'cancelled'"
                                        title="Mostrar un QR para que el cliente pague en el mostrador"
                                    >
                                        <a-button type="link" @click="openQr(record)">QR</a-button>
                                    </a-tooltip>

                                    <a-tooltip
                                        v-if="!isPaid(record)"
                                        title="Preguntarle a Mercado Pago el estado ahora, sin esperar la notificación"
                                    >
                                        <a-button type="link" @click="checkNow(record)">Chequear</a-button>
                                    </a-tooltip>

                                    <a-tooltip
                                        v-if="!isPaid(record) && record.status !== 'cancelled'"
                                        title="Anular el cobro (el link deja de mostrarse)"
                                    >
                                        <a-button type="link" danger @click="annul(record)">Anular</a-button>
                                    </a-tooltip>
                                </a-space>
                            </template>
                        </template>
                    </a-table>
                </div>
            </TableDefaultStyle>

            <div class="wrap-pagination">
                <a-pagination
                    :total="totalItems"
                    v-model:current="currentPage"
                    v-model:page-size="itemsPerPage"
                    :page-size-options="pageSizeOptions"
                    show-size-changer
                    :show-total="showTotal"
                >
                    <template #buildOptionText="props">
                        <span> {{ props.value }} Cobros por pág.</span>
                    </template>
                    <template #itemRender="{ type, originalElement }">
                        <a v-if="type === 'prev'">Ant.</a>
                        <a v-else-if="type === 'next'">Sig.</a>
                        <component :is="originalElement" v-else></component>
                    </template>
                </a-pagination>
            </div>
        </Cards>

        <NewChargeModal v-model:visible="showNewCharge" />
        <ChargeQrModal v-model:visible="showQr" :charge="qrCharge" @updated="onQrUpdated" />
        <ChargePointModal v-model:visible="showPoint" :charge="pointCharge" @updated="onQrUpdated" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import type { ColumnProps } from 'ant-design-vue/lib/table';
import { TableDefaultStyle } from '@/app/styled';
import Cards from '@/app/components/cards/frame/CardsFrame.vue';
import { useMercadoPagoChargesComposable } from '@/app/composables/mercadoPago/useMercadoPagoChargesComposable';
import {
    CHARGE_CONCEPT_LABEL,
    CHARGE_STATUS_COLOR,
    CHARGE_STATUS_LABEL,
    reconcileCharges,
} from '@/api/mercado-pago/mercado-pago-api';
import type { MercadoPagoCharge } from '@/api/mercado-pago/mercado-pago-api';
import RowNumber from '../shared/RowNumber.vue';
import ChargesFilters from './ChargesFilters.vue';
import NewChargeModal from './NewChargeModal.vue';
import ChargeQrModal from './ChargeQrModal.vue';
import ChargePointModal from './ChargePointModal.vue';

/**
 * Listado de cobros online y las acciones sobre cada uno.
 *
 * El estado que se muestra es el de Mercado Pago. "Chequear" existe porque el
 * webhook puede demorar: el usuario no tiene que quedarse esperando para saber
 * si el cliente pagó.
 */
const { accountQuery, chargesQuery, cancelMutation, refreshMutation, charges, currentPage, itemsPerPage, totalItems } =
    useMercadoPagoChargesComposable();

const { data: account } = accountQuery;
const { isLoading } = chargesQuery;

const showNewCharge = ref(false);

// Conciliación a pedido: la red de seguridad cuando el webhook no llegó.
const reconciling = ref(false);

const onReconcile = async () => {
    reconciling.value = true;

    try {
        const response = await reconcileCharges();
        message.success(response?.data?.message ?? 'Conciliado con Mercado Pago.');
        chargesQuery.refetch();
    } catch (error: any) {
        console.log('🔴 No se pudo conciliar con Mercado Pago', error?.message);
        message.error('No se pudo conciliar con Mercado Pago.');
    } finally {
        reconciling.value = false;
    }
};

// QR del mostrador: se genera por cobro y se muestra mientras se espera el pago.
const showQr = ref(false);
const qrCharge = ref<MercadoPagoCharge | null>(null);

const openQr = (charge: MercadoPagoCharge) => {
    qrCharge.value = charge;
    showQr.value = true;
};

// Terminal Point: se manda el importe a la maquinita y se espera el pago.
const showPoint = ref(false);
const pointCharge = ref<MercadoPagoCharge | null>(null);

const openPoint = (charge: MercadoPagoCharge) => {
    pointCharge.value = charge;
    showPoint.value = true;
};

/** El QR se acreditó: el listado tiene que reflejarlo ya mismo. */
const onQrUpdated = () => {
    chargesQuery.refetch();
};

// Sin cuenta conectada no se puede cobrar: el botón queda deshabilitado y el
// motivo lo explica la tarjeta de conexión que está arriba.
const canCreate = computed(() => Boolean(account.value?.is_connected));

// Las filas y la paginación las sincroniza el composable con el store.
const rows = computed<MercadoPagoCharge[]>(() => charges.value);

const pageSizeOptions = ref<string[]>(['10', '25', '50', '100']);

const showTotal = (total: number) => `Total ${total} cobros`;

const columns: ColumnProps<any>[] = [
    { title: '#', dataIndex: 'row', key: 'row', width: 60 },
    { title: 'Cliente', dataIndex: 'customer', key: 'customer' },
    { title: 'Concepto', dataIndex: 'concept', key: 'concept', width: 150 },
    { title: 'Creado', dataIndex: 'created', key: 'created', width: 120 },
    { title: 'Importe', dataIndex: 'amount', key: 'amount', align: 'right' },
    { title: 'Estado', dataIndex: 'status', key: 'status', width: 140 },
    { title: 'Pagado', dataIndex: 'paid_at', key: 'paid_at', width: 120 },
    { title: 'Acciones', dataIndex: 'actions', key: 'actions', align: 'center' },
];

const statusLabel = (status: string) => CHARGE_STATUS_LABEL[status] ?? status;

const statusColor = (status: string) => CHARGE_STATUS_COLOR[status] ?? 'default';

const conceptLabel = (concept: string) => CHARGE_CONCEPT_LABEL[concept] ?? concept;

const isPaid = (charge: MercadoPagoCharge) => charge.status === 'approved';

const copyLink = async (charge: MercadoPagoCharge) => {
    if (!charge.share_url) {
        return;
    }

    try {
        await navigator.clipboard.writeText(charge.share_url);
        message.success('Link copiado. Ya lo podés pegar en WhatsApp o en un mail.');
    } catch (error: any) {
        console.log('🔴 No se pudo copiar el link', error?.message);
        message.warning('El navegador no dejó copiar solo: copialo del detalle del cobro.');
    }
};

const sharedText = (charge: MercadoPagoCharge) => {
    const importe = `$${Number(charge.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
    const concepto = charge.title ? `${charge.title} — ` : '';

    return `${concepto}Podés pagar ${importe} desde este link: ${charge.share_url}`;
};

const shareWhatsapp = (charge: MercadoPagoCharge) => {
    if (!charge.share_url) {
        return;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(sharedText(charge))}`, '_blank');
};

const shareMail = (charge: MercadoPagoCharge) => {
    if (!charge.share_url) {
        return;
    }

    const asunto = encodeURIComponent('Link de pago');
    const cuerpo = encodeURIComponent(sharedText(charge));

    window.location.href = `mailto:?subject=${asunto}&body=${cuerpo}`;
};

const checkNow = async (charge: MercadoPagoCharge) => {
    try {
        await refreshMutation.mutateAsync(charge.id);
        message.success('Estado actualizado contra Mercado Pago.');
    } catch (error: any) {
        console.log('🔴 No se pudo revalidar el cobro', error?.message);
        message.error('No se pudo consultar el estado en Mercado Pago.');
    }
};

const annul = async (charge: MercadoPagoCharge) => {
    try {
        await cancelMutation.mutateAsync(charge.id);
        message.success('Cobro anulado.');
    } catch (error: any) {
        console.log('🔴 No se pudo anular el cobro', error?.message);
        message.error('No se pudo anular el cobro.');
    }
};
</script>

<style scoped>
.mp-table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.mp-review-tag {
    margin-left: 6px;
}
</style>
