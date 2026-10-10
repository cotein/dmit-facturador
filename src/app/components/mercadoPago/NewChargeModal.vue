<template>
    <a-modal
        v-model:visible="visible"
        title="Nuevo cobro online"
        :confirm-loading="creating"
        :ok-text="created ? 'Cerrar' : 'Generar link'"
        :cancel-text="created ? 'Generar otro' : 'Cancelar'"
        :ok-button-props="{ disabled: !created && !puedeGenerar }"
        width="620px"
        @ok="onOk"
        @cancel="onCancel"
    >
        <!-- Resultado: el link, listo para compartir sin salir del modal. -->
        <div v-if="created" class="mp-result">
            <a-result
                status="success"
                title="Link de cobro generado"
                :sub-title="`${$filters.formatCurrency(created.amount)} · ${conceptLabel(created.concept)}`"
            >
                <template #extra>
                    <a-space direction="vertical" style="width: 100%">
                        <a-input :value="created.share_url" readonly />
                        <a-space>
                            <a-button type="primary" @click="copyLink">Copiar link</a-button>
                            <a-button @click="shareWhatsapp">WhatsApp</a-button>
                            <a-button @click="shareMail">Mail</a-button>
                        </a-space>
                        <p class="mp-result-hint">
                            Cuando el cliente pague, Mercado Pago avisa a DMIT y el comprobante se imputa solo. No hace
                            falta que hagas nada más.
                        </p>
                    </a-space>
                </template>
            </a-result>
        </div>

        <!-- Alta -->
        <a-form v-else layout="vertical">
            <a-form-item label="Importe" required>
                <a-input-number
                    v-model:value="form.amount"
                    class="mp-full"
                    :min="0.01"
                    :precision="2"
                    :step="100"
                    placeholder="0,00"
                />
            </a-form-item>

            <a-form-item label="Concepto" required>
                <a-select v-model:value="form.concept" :options="conceptOptions" class="mp-full" />
            </a-form-item>

            <a-form-item label="Cliente">
                <a-select
                    v-model:value="form.customer_id"
                    class="mp-full"
                    show-search
                    allow-clear
                    placeholder="Elegí el cliente (opcional)"
                    :filter-option="filtrarCliente"
                    :options="customerOptions"
                    :loading="loadingCustomers"
                />
            </a-form-item>

            <a-form-item v-if="form.concept === 'invoice'" label="Comprobante a saldar">
                <a-select
                    v-model:value="form.sale_invoice_id"
                    class="mp-full"
                    allow-clear
                    placeholder="Elegí el comprobante"
                    :options="invoiceOptions"
                    :loading="loadingInvoices"
                    :disabled="!form.customer_id"
                />
                <span class="mp-hint">Con comprobante elegido, al pagarse se marca como saldado.</span>
            </a-form-item>

            <a-form-item label="Detalle para el cliente">
                <a-input v-model:value="form.title" placeholder="Ej: Compra de mercadería" :maxlength="120" />
            </a-form-item>

            <a-form-item label="Vence en (días)">
                <a-input-number v-model:value="form.expires_in_days" class="mp-full" :min="1" :max="60" />
                <span class="mp-hint">Si no se paga antes de esa fecha, el link deja de aceptar pagos.</span>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useMercadoPagoChargesComposable } from '@/app/composables/mercadoPago/useMercadoPagoChargesComposable';
import { getCustomers } from '@/api/customer/customer-api';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { CHARGE_CONCEPT_LABEL } from '@/api/mercado-pago/mercado-pago-api';
import type { MercadoPagoCharge, MercadoPagoChargeConcept } from '@/api/mercado-pago/mercado-pago-api';

/**
 * Alta de un cobro: se elige concepto, cliente y comprobante, y el resultado es
 * el link para compartir. El modal no se cierra al generar: el paso siguiente
 * natural es mandarlo, y volver a abrirlo para eso sería una molestia.
 */
const props = defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (e: 'update:visible', value: boolean): void }>();

const { createMutation, chargesQuery } = useMercadoPagoChargesComposable();
const { CompanyGetter } = useCompanyComposable();

const visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value),
});

const conceptOptions = Object.entries(CHARGE_CONCEPT_LABEL)
    .filter(([value]) => value !== 'sale')
    .map(([value, label]) => ({ value, label }));

const form = ref<{
    amount: number | null;
    concept: MercadoPagoChargeConcept;
    customer_id: number | null;
    sale_invoice_id: number | null;
    title: string;
    expires_in_days: number | null;
}>({
    amount: null,
    concept: 'manual',
    customer_id: null,
    sale_invoice_id: null,
    title: '',
    expires_in_days: null,
});

const created = ref<MercadoPagoCharge | null>(null);
const creating = computed(() => createMutation.isLoading.value);

const puedeGenerar = computed(() => Number(form.value.amount ?? 0) > 0);

const customers = ref<any[]>([]);
const loadingCustomers = ref(false);

const customerOptions = computed(() =>
    customers.value.map((customer: any) => ({ value: customer.id, label: customer.name })),
);

const filtrarCliente = (input: string, option: any) =>
    String(option?.label ?? '')
        .toLowerCase()
        .includes(input.toLowerCase());

const invoices = ref<any[]>([]);
const loadingInvoices = ref(false);

const formatImporte = (invoice: any) => {
    const total = Number(invoice.total ?? invoice.importe ?? 0);

    return `$${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
};

const invoiceOptions = computed(() =>
    invoices.value.map((invoice: any) => ({
        value: invoice.id,
        label: `${invoice.voucher?.name ?? 'Comprobante'} ${invoice.number ?? invoice.id} · ${formatImporte(invoice)}`,
    })),
);

// Los comprobantes del cliente se piden recién cuando hacen falta: cargarlos
// siempre sería pagar una consulta por abrir el modal.
const loadCustomers = async () => {
    const companyId = CompanyGetter.value?.id;

    if (!companyId || customers.value.length) {
        return;
    }

    loadingCustomers.value = true;

    try {
        // getCustomers devuelve { data, pagination } directo (no AxiosResponse):
        // por eso las filas están en response.data y no en response.data.data.
        const response = await getCustomers(companyId);

        customers.value = response?.data ?? [];
    } catch (error: any) {
        console.log('🔴 No se pudieron cargar los clientes', error?.message);
    } finally {
        loadingCustomers.value = false;
    }
};

watch(
    () => form.value.customer_id,
    async (customerId) => {
        invoices.value = [];
        form.value.sale_invoice_id = null;

        const companyId = CompanyGetter.value?.id;

        if (!customerId || !companyId || form.value.concept !== 'invoice') {
            return;
        }

        loadingInvoices.value = true;

        try {
            const response = await getInvoiceList(companyId, customerId);

            // Sólo lo que todavía se puede cobrar.
            invoices.value = (response?.data?.data ?? []).filter(
                (invoice: any) => !invoice.status_id || invoice.status_id < 3,
            );
        } catch (error: any) {
            console.log('🔴 No se pudieron cargar los comprobantes', error?.message);
        } finally {
            loadingInvoices.value = false;
        }
    },
);

watch(
    () => props.visible,
    (isVisible) => {
        if (!isVisible) {
            return;
        }

        loadCustomers();
    },
);

const conceptLabel = (concept: string) => CHARGE_CONCEPT_LABEL[concept] ?? concept;

const onOk = async () => {
    if (created.value) {
        visible.value = false;

        return;
    }

    if (!puedeGenerar.value) {
        message.warning('Poné un importe mayor a cero.');

        return;
    }

    try {
        const response = await createMutation.mutateAsync({
            amount: Number(form.value.amount),
            concept: form.value.concept,
            customer_id: form.value.customer_id,
            sale_invoice_id: form.value.concept === 'invoice' ? form.value.sale_invoice_id : null,
            title: form.value.title || null,
            expires_in_days: form.value.expires_in_days,
        });

        created.value = response?.data?.data ?? null;
        chargesQuery.refetch();
    } catch (error: any) {
        console.log('🔴 No se pudo generar el cobro', error?.message);
        message.error(error?.response?.data?.message ?? 'No se pudo generar el link de cobro con Mercado Pago.');
    }
};

const onCancel = () => {
    if (created.value) {
        resetForm();

        return;
    }

    visible.value = false;
};

const resetForm = () => {
    created.value = null;
    form.value = {
        amount: null,
        concept: 'manual',
        customer_id: null,
        sale_invoice_id: null,
        title: '',
        expires_in_days: null,
    };
};

const copyLink = async () => {
    if (!created.value?.share_url) {
        return;
    }

    try {
        await navigator.clipboard.writeText(created.value.share_url);
        message.success('Link copiado.');
    } catch (error: any) {
        console.log('🔴 No se pudo copiar el link', error?.message);
    }
};

const sharedText = () => {
    if (!created.value?.share_url) {
        return '';
    }

    const importe = `$${Number(created.value.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

    return `${created.value.title ? created.value.title + ' — ' : ''}Podés pagar ${importe} desde este link: ${
        created.value.share_url
    }`;
};

const shareWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(sharedText())}`, '_blank');
};

const shareMail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent('Link de pago')}&body=${encodeURIComponent(
        sharedText(),
    )}`;
};
</script>

<style scoped>
.mp-full {
    width: 100%;
}

.mp-hint {
    display: block;
    margin-top: 4px;
    color: #8c8c8c;
    font-size: 12px;
}

.mp-result-hint {
    color: #595959;
    font-size: 13px;
    max-width: 480px;
}
</style>
