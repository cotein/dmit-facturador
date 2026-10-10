<template>
    <div class="mp-summary-card">
        <div class="mp-summary-head">
            <div class="mp-summary-title">
                <span class="mp-dot"></span>
                Cobros online
            </div>
            <router-link :to="{ name: 'OnlineChargesList' }" class="mp-link">Ver todos</router-link>
        </div>

        <!-- Cargando -->
        <div v-if="loading" class="mp-loading">
            <a-skeleton active :paragraph="{ rows: 3 }" />
        </div>

        <!-- Sin cuenta conectada -->
        <div v-else-if="!connected" class="mp-empty">
            <p>Conectá la cuenta de Mercado Pago del comercio para cobrar por link o QR.</p>
            <router-link :to="{ name: 'OnlineChargesList' }">
                <a-button type="primary">Conectar Mercado Pago</a-button>
            </router-link>
        </div>

        <!-- Con datos -->
        <div v-else class="mp-body">
            <div class="mp-metric">
                <span class="mp-metric-label">Acreditado</span>
                <span class="mp-metric-value is-ok">{{ $filters.formatCurrency(totales.acreditado) }}</span>
            </div>
            <div class="mp-metric">
                <span class="mp-metric-label">Pendiente</span>
                <span class="mp-metric-value is-wait">{{ $filters.formatCurrency(totales.pendiente) }}</span>
            </div>
            <div class="mp-metric">
                <span class="mp-metric-label">Cobros</span>
                <span class="mp-metric-value">{{ totales.cantidad }}</span>
            </div>

            <div v-if="ultimos.length" class="mp-last">
                <span class="mp-last-label">Últimos</span>
                <ul>
                    <li v-for="cobro in ultimos" :key="cobro.id">
                        <span class="mp-last-amount">{{ $filters.formatCurrency(cobro.amount) }}</span>
                        <span class="mp-last-state" :class="`is-${cobro.status}`">{{ estado(cobro.status) }}</span>
                    </li>
                </ul>
            </div>

            <p v-else class="mp-hint">Todavía no generaste cobros online.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CHARGE_STATUS_LABEL, getCharges, getMercadoPagoAccount } from '@/api/mercado-pago/mercado-pago-api';
import type { MercadoPagoCharge } from '@/api/mercado-pago/mercado-pago-api';

/**
 * Resumen de Cobros online para el dashboard: lo que entró por Mercado Pago,
 * lo que está pendiente y los últimos movimientos.
 *
 * Es el puente entre el módulo de pagos y la pantalla de inicio: sin esto, los
 * cobros quedaban en una pantalla aparte que nadie mira.
 */
const loading = ref(true);
const connected = ref(false);
const cobros = ref<MercadoPagoCharge[]>([]);

const totales = computed(() => {
    const lista = cobros.value;

    const suma = (estados: string[]) =>
        lista
            .filter((cobro) => estados.includes(cobro.status))
            .reduce((total, cobro) => total + Number(cobro.amount || 0), 0);

    return {
        acreditado: suma(['approved']),
        pendiente: suma(['pending', 'in_process']),
        cantidad: lista.length,
    };
});

const ultimos = computed(() => cobros.value.slice(0, 3));

const estado = (status: string) => CHARGE_STATUS_LABEL[status] ?? status;

onMounted(async () => {
    try {
        const cuenta = await getMercadoPagoAccount();
        connected.value = Boolean(cuenta?.data?.data);

        if (!connected.value) {
            return;
        }

        const respuesta = await getCharges({ page: 1, per_page: 50 });
        cobros.value = respuesta?.data?.data ?? [];
    } catch (e: any) {
        console.log('🔴 No se pudo cargar el resumen de Mercado Pago', e?.message);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.mp-summary-card {
    height: 100%;
    padding: 22px 24px;
    background: #fff;
    border: 1px solid #efedf4;
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(130, 49, 211, 0.06);
    transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mp-summary-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 34px rgba(130, 49, 211, 0.14);
}

.mp-summary-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
}

.mp-summary-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: #1b1b27;
}

.mp-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #8231d3;
}

.mp-link {
    font-size: 13px;
    color: #8231d3;
}

.mp-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.mp-metric {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

.mp-metric-label {
    font-size: 13px;
    color: #6b7280;
}

.mp-metric-value {
    font-size: 20px;
    font-weight: 700;
    color: #1b1b27;
    font-variant-numeric: tabular-nums;
}

.mp-metric-value.is-ok {
    color: #0e9f6e;
}

.mp-metric-value.is-wait {
    color: #b7791f;
}

.mp-last ul {
    margin: 8px 0 0;
    padding: 0;
    list-style: none;
}

.mp-last li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-top: 1px solid #f4f2f8;
    font-size: 13px;
}

.mp-last-label {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #8a8f9c;
}

.mp-last-amount {
    font-variant-numeric: tabular-nums;
    color: #1b1b27;
}

.mp-last-state {
    font-size: 12px;
    color: #6b7280;
}

.mp-last-state.is-approved {
    color: #0e9f6e;
}

.mp-last-state.is-rejected,
.mp-last-state.is-refunded {
    color: #e02424;
}

.mp-hint,
.mp-empty p {
    margin: 0 0 12px;
    font-size: 13px;
    color: #8a8f9c;
}
</style>
