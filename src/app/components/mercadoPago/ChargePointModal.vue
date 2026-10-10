<template>
    <a-modal
        v-model:visible="visibleKey"
        title="Cobrar con la terminal"
        :footer="null"
        width="440px"
        :mask-closable="!paid"
        @cancel="onClose"
    >
        <!-- Cobrado -->
        <div v-if="paid" class="pt-state">
            <a-result
                status="success"
                title="¡Pago acreditado!"
                :sub-title="`${importe} · ${charge?.title || 'Cobro en mostrador'}`"
            >
                <template #extra>
                    <a-button type="primary" @click="onClose">Cerrar</a-button>
                </template>
            </a-result>
        </div>

        <!-- Enviado: esperando que el cliente pase la tarjeta -->
        <div v-else-if="sent" class="pt-state">
            <a-spin />
            <p class="pt-line">El cobro ya está en la terminal.</p>
            <p class="pt-hint">
                Que el cliente pase la tarjeta. El estado se actualiza solo; si tarda, podés chequearlo a mano.
            </p>
            <a-space>
                <a-button :loading="checking" @click="check">Chequear estado</a-button>
                <a-button @click="onClose">Cerrar</a-button>
            </a-space>
        </div>

        <!-- Alta -->
        <div v-else class="pt-form">
            <a-alert v-if="error" type="error" show-icon message="No se pudo enviar" :description="error" />

            <a-form layout="vertical">
                <a-form-item label="Terminal">
                    <a-select
                        v-model:value="deviceId"
                        class="pt-full"
                        placeholder="Elegí la terminal"
                        :loading="loadingDevices"
                        :options="deviceOptions"
                    />
                    <span v-if="!loadingDevices && !deviceOptions.length" class="pt-hint">
                        No hay terminales asociadas a la cuenta de Mercado Pago.
                    </span>
                </a-form-item>

                <a-form-item label="Cuotas">
                    <a-input-number v-model:value="installments" class="pt-full" :min="1" :max="24" />
                </a-form-item>

                <a-form-item>
                    <a-button type="primary" :loading="sending" :disabled="!deviceId" block @click="send">
                        Enviar {{ importe }} a la terminal
                    </a-button>
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { getCharge, getPointDevices, sendChargeToPoint } from '@/api/mercado-pago/mercado-pago-api';
import type { MercadoPagoCharge } from '@/api/mercado-pago/mercado-pago-api';

/**
 * Cobro con la terminal Point.
 *
 * Manda el importe a la maquinita y espera: el cliente pasa la tarjeta y el
 * estado llega por el webhook. Se consulta NUESTRA base (barata) cada 4 s; no se
 * le pregunta a Mercado Pago en cada vuelta.
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
const MAX_TICS = 45;

const loadingDevices = ref(false);
const sending = ref(false);
const checking = ref(false);
const error = ref<string | null>(null);
const devices = ref<Array<{ value: string; label: string }>>([]);
const deviceId = ref<string | null>(null);
const installments = ref<number>(1);
const sent = ref(false);
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

const deviceOptions = computed(() => devices.value);

const loadDevices = async () => {
    loadingDevices.value = true;

    try {
        const response = await getPointDevices();
        devices.value = (response?.data?.data ?? [])
            .filter((device) => Boolean(device.id))
            .map((device) => ({ value: device.id as string, label: device.name || (device.id as string) }));
    } catch (e: any) {
        console.log('🔴 No se pudieron leer las terminales', e?.message);
        error.value = e?.response?.data?.message ?? 'No se pudieron leer las terminales de Mercado Pago.';
    } finally {
        loadingDevices.value = false;
    }
};

const send = async () => {
    if (!props.charge || !deviceId.value) {
        return;
    }

    sending.value = true;
    error.value = null;

    try {
        await sendChargeToPoint(props.charge.id, {
            device_id: deviceId.value,
            installments: installments.value,
        });

        sent.value = true;
        emit('updated');
        arrancarPolling();
    } catch (e: any) {
        console.log('🔴 No se pudo enviar el cobro a la terminal', e?.message);
        error.value = e?.response?.data?.message ?? 'Mercado Pago rechazó el envío a la terminal.';
    } finally {
        sending.value = false;
    }
};

const check = async () => {
    if (!props.charge || paid.value) {
        return;
    }

    checking.value = true;

    try {
        const response = await getCharge(props.charge.id);
        const estado = response?.data?.data?.status;

        if (estado === 'approved') {
            paid.value = true;
            detenerPolling();
            emit('updated');
        } else if (estado && estado !== 'pending' && estado !== 'in_process') {
            detenerPolling();
            error.value = `Mercado Pago informó que el cobro quedó "${estado}".`;
            sent.value = false;
        }
    } catch (e: any) {
        console.log('🔴 No se pudo chequear el cobro', e?.message);
    } finally {
        checking.value = false;
    }
};

const arrancarPolling = () => {
    detenerPolling();

    timer = setInterval(() => {
        tics.value += 1;

        if (tics.value > MAX_TICS) {
            detenerPolling();

            return;
        }

        check();
    }, TICK_MS);
};

const detenerPolling = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
};

const onClose = () => {
    detenerPolling();
    visibleKey.value = false;
};

watch(
    () => props.visible,
    (isVisible) => {
        if (!isVisible) {
            detenerPolling();

            return;
        }

        error.value = null;
        sent.value = false;
        paid.value = false;
        tics.value = 0;
        loadDevices();
    },
);

onBeforeUnmount(() => detenerPolling());
</script>

<style scoped>
.pt-state,
.pt-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.pt-state {
    align-items: center;
    text-align: center;
}

.pt-line {
    margin: 0;
    font-weight: 600;
}

.pt-hint {
    display: block;
    margin: 0;
    color: #8c8c8c;
    font-size: 12px;
}

.pt-full {
    width: 100%;
}
</style>
