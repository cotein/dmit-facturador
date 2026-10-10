<template>
    <Cards class="mp-connect-card">
        <template #title>
            <div class="mp-connect-header">
                <span>Cobros con Mercado Pago</span>
                <a-tag v-if="account?.is_connected" color="green">Conectado</a-tag>
                <a-tag v-else-if="account?.status === 'error'" color="red">Con error</a-tag>
                <a-tag v-else color="blue">Sin conectar</a-tag>
            </div>
        </template>

        <a-spin :spinning="isLoading">
            <!-- Conectado: se muestra de quién es la cuenta que cobra. -->
            <div v-if="account?.is_connected" class="mp-connect-body">
                <p class="mp-connect-line">
                    Los cobros de esta empresa entran directo a la cuenta
                    <strong>{{ account.nickname || account.email || 'de Mercado Pago' }}</strong
                    >.
                </p>
                <p class="mp-connect-line mp-connect-muted">Token renovado: {{ tokenExpiry }}</p>

                <a-popconfirm
                    title="¿Desconectar la cuenta? La empresa deja de poder generar links de pago."
                    ok-text="Desconectar"
                    cancel-text="Cancelar"
                    @confirm="onDisconnect"
                >
                    <a-button danger :loading="disconnecting">Desconectar</a-button>
                </a-popconfirm>
            </div>

            <!-- Con error: el motivo se muestra tal cual lo dijo Mercado Pago. -->
            <div v-else-if="account?.status === 'error'" class="mp-connect-body">
                <a-alert
                    type="error"
                    show-icon
                    message="La conexión con Mercado Pago necesita atención"
                    :description="account.last_error || 'No se pudo renovar el token.'"
                />
                <a-button type="primary" class="mp-connect-action" :loading="connecting" @click="onConnect">
                    Reconectar
                </a-button>
            </div>

            <!-- Sin conectar: es el estado inicial, y explica para qué sirve. -->
            <div v-else class="mp-connect-body">
                <p class="mp-connect-line">
                    Conectá la cuenta de Mercado Pago del comercio para poder generar links de cobro y compartirlos con
                    tus clientes. El dinero entra directo a tu cuenta, no pasa por DMIT.
                </p>
                <a-button type="primary" :loading="connecting" @click="onConnect">
                    <unicon name="link-h"></unicon>
                    Conectar Mercado Pago
                </a-button>
            </div>
        </a-spin>
    </Cards>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import Cards from '@/app/components/cards/frame/CardsFrame.vue';
import { useMercadoPagoChargesComposable } from '@/app/composables/mercadoPago/useMercadoPagoChargesComposable';

/**
 * Estado de la conexión de la empresa con Mercado Pago.
 *
 * Es lo primero de la pantalla porque sin cuenta conectada no se puede cobrar:
 * el resto del módulo queda sin sentido.
 */
const { accountQuery, connect, disconnectMutation } = useMercadoPagoChargesComposable();

const { data: account, isLoading } = accountQuery;

const connecting = ref(false);
const disconnecting = ref(false);

const tokenExpiry = computed(() => (account.value?.token_expires_at ? 'sí' : 'se renueva solo'));

const onConnect = async () => {
    connecting.value = true;

    try {
        await connect();
    } catch (error: any) {
        console.log('🔴 No se pudo iniciar la conexión con Mercado Pago', error?.message);
        message.error('No se pudo iniciar la conexión con Mercado Pago.');
        connecting.value = false;
    }
};

const onDisconnect = async () => {
    disconnecting.value = true;

    try {
        await disconnectMutation.mutateAsync();
        message.success('Cuenta de Mercado Pago desconectada.');
    } catch (error: any) {
        console.log('🔴 No se pudo desconectar la cuenta', error?.message);
        message.error('No se pudo desconectar la cuenta.');
    } finally {
        disconnecting.value = false;
    }
};
</script>

<style scoped>
.mp-connect-header {
    display: flex;
    align-items: center;
    gap: 8px;
}

.mp-connect-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
}

.mp-connect-line {
    margin: 0;
    max-width: 720px;
}

.mp-connect-muted {
    color: #8c8c8c;
    font-size: 12px;
}

.mp-connect-action {
    margin-top: 4px;
}
</style>
