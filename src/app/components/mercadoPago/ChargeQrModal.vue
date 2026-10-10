<template>
    <a-modal
        v-model:visible="visibleKey"
        title="Cobro con QR"
        :footer="null"
        width="440px"
        :mask-closable="!paid"
        @cancel="onClose"
    >
        <!-- Generando -->
        <div v-if="loading" class="qr-state">
            <a-spin />
            <span class="qr-state-text">Generando el QR con Mercado Pago…</span>
        </div>

        <!-- Error del alta del QR -->
        <div v-else-if="error" class="qr-state">
            <a-alert type="error" show-icon message="No se pudo generar el QR" :description="error" />
            <a-button type="primary" class="qr-action" @click="load">Reintentar</a-button>
        </div>

        <!-- Pagado -->
        <div v-else-if="paid" class="qr-state">
            <a-result
                status="success"
                title="¡Pago acreditado!"
                :sub-title="`${importe} · ${charge?.title || 'Cobro en mostrador'}`"
            >
                <template #extra>
                    <p class="qr-hint">
                        El cobro ya quedó registrado y, si estaba asociado a un comprobante, se imputó solo.
                    </p>
                    <a-button type="primary" @click="onClose">Cerrar</a-button>
                </template>
            </a-result>
        </div>

        <!-- Esperando el pago -->
        <div v-else class="qr-body">
            <img v-if="qrImage" :src="qrImage" class="qr-image" alt="Código QR de Mercado Pago" />
            <p class="qr-amount">{{ importe }}</p>
            <p class="qr-hint">Que el cliente lo escanee con la app de Mercado Pago. El estado se actualiza solo.</p>

            <a-space class="qr-actions">
                <a-button :loading="checking" @click="checkNow">
                    <unicon name="sync"></unicon>
                    Ya pagó, chequear
                </a-button>
                <a-button @click="copyReference">Copiar referencia</a-button>
            </a-space>

            <p class="qr-ref">Referencia: {{ charge?.external_reference }}</p>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import QRious from 'qrious';
import { createChargeQr, getCharge, refreshCharge } from '@/api/mercado-pago/mercado-pago-api';
import type { MercadoPagoCharge } from '@/api/mercado-pago/mercado-pago-api';

/**
 * QR dinámico del mostrador.
 *
 * Mientras está abierto consulta el estado cada 4 segundos: en el mostrador
 * nadie va a apretar "actualizar" con un cliente adelante. La consulta normal es
 * a NUESTRA base (el webhook de Mercado Pago la actualiza apenas se paga); recién
 * cada ~32 segundos se le pregunta a Mercado Pago, que es la consulta cara. Se
 * corta solo cuando el pago se acredita o a los ~3 minutos.
 */
const props = defineProps<{
    visible: boolean;
    charge: MercadoPagoCharge | null;
}>();

const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void;
    (e: 'updated'): void;
}>();

const TICK_MS = 4000;
const TICS_POR_CONSULTA_A_MP = 8;
const MAX_TICS = 48;

const loading = ref(false);
const checking = ref(false);
const error = ref<string | null>(null);
const qrImage = ref<string | null>(null);
const paid = ref(false);
const tics = ref(0);

let timer: ReturnType<typeof setInterval> | null = null;

const visibleKey = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value),
});

const importe = computed(() => {
    const amount = Number(props.charge?.amount ?? 0);

    return `$${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
});

const load = async () => {
    if (!props.charge) {
        return;
    }

    loading.value = true;
    error.value = null;
    paid.value = false;
    tics.value = 0;
    qrImage.value = null;

    try {
        const response = await createChargeQr(props.charge.id);
        const data = response?.data?.data;

        // Mercado Pago devuelve la imagen del QR de la caja. El texto (qr_data)
        // queda como respaldo por si alguna vez lo devolviera.
        if (data?.qr_image) {
            qrImage.value = data.qr_image;
        } else if (data?.qr_data) {
            qrImage.value = new QRious({ value: data.qr_data, size: 260 }).toDataURL();
        } else {
            throw new Error('Mercado Pago no devolvió el QR.');
        }

        arrancarPolling();
    } catch (e: any) {
        console.log('🔴 No se pudo generar el QR de Mercado Pago', e?.message);
        error.value = e?.response?.data?.message ?? e?.message ?? 'Error inesperado.';
    } finally {
        loading.value = false;
    }
};

/**
 * Chequeo liviano: lee NUESTRA base, que el webhook mantiene al día.
 * Devuelve true cuando el cobro ya no está pendiente (paga o rechazada).
 */
const chequearLocal = async (): Promise<boolean> => {
    if (!props.charge) {
        return true;
    }

    try {
        const response = await getCharge(props.charge.id);
        const estado = response?.data?.data?.status;

        return aplicarEstado(estado);
    } catch (e: any) {
        console.log('🔴 No se pudo leer el estado del cobro', e?.message);

        return false;
    }
};

/**
 * Chequeo contra Mercado Pago: es el caro, va cada ~32 s o cuando el usuario
 * aprieta el botón.
 */
const checkNow = async () => {
    if (!props.charge || paid.value) {
        return;
    }

    checking.value = true;

    try {
        const response = await refreshCharge(props.charge.id);

        aplicarEstado(response?.data?.data?.status);
    } catch (e: any) {
        console.log('🔴 No se pudo consultar el estado en Mercado Pago', e?.message);
    } finally {
        checking.value = false;
    }
};

/** Aplica el estado y corta el polling si el cobro ya terminó. */
const aplicarEstado = (estado?: string | null): boolean => {
    if (estado === 'approved') {
        paid.value = true;
        detenerPolling();
        emit('updated');

        return true;
    }

    if (estado && estado !== 'pending' && estado !== 'in_process') {
        // Rechazado o anulado: no tiene sentido seguir esperando.
        detenerPolling();
        error.value = `Mercado Pago informó que el cobro quedó "${estado}".`;

        return true;
    }

    return false;
};

const arrancarPolling = () => {
    detenerPolling();

    timer = setInterval(async () => {
        tics.value += 1;

        if (tics.value > MAX_TICS) {
            detenerPolling();

            return;
        }

        // Cada tanto se le pregunta a Mercado Pago; el resto de las veces alcanza
        // con nuestra base, que es la que actualiza el webhook.
        if (tics.value % TICS_POR_CONSULTA_A_MP === 0) {
            await checkNow();

            return;
        }

        await chequearLocal();
    }, TICK_MS);
};

const detenerPolling = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
};

const copyReference = async () => {
    if (!props.charge?.external_reference) {
        return;
    }

    try {
        await navigator.clipboard.writeText(props.charge.external_reference);
        message.success('Referencia copiada.');
    } catch (e: any) {
        console.log('🔴 No se pudo copiar la referencia', e?.message);
    }
};

const onClose = () => {
    detenerPolling();
    visibleKey.value = false;
};

watch(
    () => props.visible,
    (isVisible) => {
        if (isVisible) {
            load();
        } else {
            detenerPolling();
        }
    },
);

onBeforeUnmount(() => detenerPolling());
</script>

<style scoped>
.qr-body,
.qr-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    padding: 8px 4px;
}

.qr-state-text {
    color: #595959;
}

.qr-image {
    border: 1px solid #f0f0f0;
    border-radius: 12px;
    padding: 8px;
    background: #fff;
}

.qr-amount {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
}

.qr-hint {
    margin: 0;
    max-width: 340px;
    color: #595959;
}

.qr-actions {
    margin-top: 4px;
}

.qr-ref {
    margin: 0;
    color: #8c8c8c;
    font-size: 12px;
}

.qr-action {
    margin-top: 8px;
}
</style>
