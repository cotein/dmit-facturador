<template>
    <a-drawer
        title="Datos del Cliente"
        :width="drawerWidth()"
        :visible="openDrawerDatosCliente"
        :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }"
        :maskClosable="false"
        @close="onClose"
        @afterVisibleChange="afterVisibleChange"
    >
        <a-form :model="invoice" layout="vertical" ref="invoiceConfigForm" @submit.prevent="onClose">
            <!-- El cliente de la venta, aparte y en lectura: el buscador de abajo abre
                 vacío y no edita a este cliente; si elegís otro, esta línea cambia. -->
            <p class="invoice-current-customer" data-testid="pos-current-customer">
                <span>Cliente de la venta:</span>
                <b data-testid="pos-current-customer-label">{{ currentCustomerLabel }}</b>
                <span v-if="isDefaultCustomer" class="invoice-current-customer__note">(por defecto)</span>
            </p>

            <a-row :gutter="16">
                <a-col :sm="24" :lg="24" :xs="24">
                    <a-form-item
                        label="Buscar cliente"
                        name="customer"
                        :validate-status="errors.customer ? 'error' : ''"
                        :help="errors.customer"
                    >
                        <SearchCustomer
                            :context="'invoice'"
                            :multiple="false"
                            :start-empty="true"
                            ref="searchCustomerRef"
                        />
                    </a-form-item>
                    <p class="invoice-customer-hint">
                        Buscá por nombre y elegí el cliente de esta venta. El campo arranca vacío: no estás editando al
                        cliente actual.
                    </p>
                </a-col>
                <a-col :sm="24" :lg="24" :xs="24">
                    <a-form-item
                        label="Seleccionar tipo de comprobante a realizar"
                        name="voucher"
                        :validate-status="errors.voucher ? 'error' : ''"
                        :help="errors.voucher"
                    >
                        <VoucherSelect />
                    </a-form-item>
                </a-col>
            </a-row>

            <InvoiceFieldsForm :columns="2" :errors="errors" />

            <a-space>
                <a-button @click="onCloseCancel">Cancelar</a-button>
                <a-button type="primary" @click="onClose">Aceptar</a-button>
            </a-space>
        </a-form>
        <template #extra> </template>
    </a-drawer>
</template>
<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { useCustomerComposable } from '@/app/composables/customer/useCustomerComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import SearchCustomer from '../customer/SearchCustomer.vue';
import VoucherSelect from './VoucherSelect.vue';
import InvoiceFieldsForm from './InvoiceFieldsForm.vue';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import { z } from 'zod';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';
import { AFIP_INSCRIPTION } from '@/app/types/Constantes';

/**
 * Datos del cliente y configuración del comprobante, en un drawer.
 *
 * Trae el buscador de clientes y los campos del comprobante; los botones que lo abren
 * viven arriba de la pantalla de facturación (`PosCustomerActions`), no acá adentro:
 * estaban perdidos entre los campos y había que bajar hasta ellos para encontrarlos.
 */
const { drawerWidth } = useMediaQueryComposable();

const errors = ref<Record<string, string | undefined>>({});

const searchCustomerRef = ref<any>(null);

const { openDrawerDatosCliente } = useVisibleComposable();

const { selectedCustomer } = useCustomerComposable();

const { invoice, invoiceInitialStatus } = useInvoiceComposable();

const invoiceConfigForm = ref();

/** Id del cliente que viene puesto por defecto en toda venta nueva (Consumidor Final). */
const DEFAULT_CUSTOMER_ID = 1;

/**
 * `invoice.customer` guarda el objeto que devuelve el buscador (`{ value, label, … }`),
 * pero el tipo del store declara el `Customer` de la API. Se lee la forma real del
 * select —sólo lo que se muestra— con un tipo propio, sin tocar el store.
 */
type CurrentCustomerView = {
    value?: number;
    label?: string;
    afip_inscription?: { id?: number };
};

const currentCustomer = computed(() => invoice.value.customer as unknown as CurrentCustomerView | null);

const currentCustomerLabel = computed(() => currentCustomer.value?.label || 'Sin cliente seleccionado');

/** Consumidor Final: el cliente con el que arranca la venta, no uno elegido a mano. */
const isDefaultCustomer = computed(() => {
    const customer = currentCustomer.value;

    if (!customer) {
        return false;
    }

    return (
        Number(customer.value) === DEFAULT_CUSTOMER_ID ||
        Number(customer.afip_inscription?.id) === AFIP_INSCRIPTION.CONSUMIDOR_FINAL
    );
});

const onCloseCancel = () => {
    errors.value = {};
    openDrawerDatosCliente.value = false;

    // El punto de venta no es parte de lo que se cancela: sale de la empresa y
    // `invoiceInitialStatus()` lo deja en null. Sin restaurarlo, cancelar el drawer
    // dejaba el comprobante sin punto de venta hasta recargar la página.
    const ptoVta = invoice.value.PtoVta;

    invoiceInitialStatus();

    invoice.value.PtoVta = ptoVta;

    returnFocusAfterClose();
};

/**
 * `Esc` cierra el drawer.
 *
 * Ant lo cierra solo, pero el `Esc` se pierde cuando el foco está adentro de un
 * desplegable (el select de comprobante/condición lo consume): con el teclado no había
 * forma de salir del drawer sin tabular hasta "Cancelar". El listener vive en la ventana
 * mientras el drawer está abierto, así que funciona sin importar dónde esté el foco.
 *
 * Va en fase de CAPTURA a propósito: con el foco adentro de un control de Ant (el select
 * de comprobante, un date picker), ese control corta la propagación del `Esc` y el evento
 * nunca llega a un listener de burbuja en la ventana.
 */
const onWindowKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && openDrawerDatosCliente.value) {
        event.preventDefault();
        onCloseCancel();
    }
};

watch(openDrawerDatosCliente, (open) => {
    if (open) {
        window.addEventListener('keydown', onWindowKeydown, true);

        // Además del `afterVisibleChange` (que llega al terminar la transición): con
        // esto el campo queda vacío desde el primer frame, aunque la animación no corra.
        prepareCustomerSearch();
    } else {
        window.removeEventListener('keydown', onWindowKeydown, true);
    }
});

onUnmounted(() => {
    window.removeEventListener('keydown', onWindowKeydown, true);
});

/**
 * Al cerrar, el foco no puede quedarse adentro del drawer.
 *
 * Ant mantiene el contenido montado, así que el foco seguía en un campo invisible: lo
 * que se tipeaba después caía ahí y el siguiente `Tab` recorría contenido oculto. Vuelve
 * al disparador (el botón de cliente) o, en el mostrador, al buscador.
 */
const returnFocusAfterClose = () => {
    nextTick(() => {
        const active = document.activeElement as HTMLElement | null;

        if (!active || !active.closest('.ant-drawer')) {
            return;
        }

        const target =
            (document.querySelector('[data-action="change-customer"]') as HTMLElement | null) ??
            (document.querySelector('[data-action="open-customer-drawer"]') as HTMLElement | null) ??
            (document.querySelector('#pos-search-input') as HTMLElement | null);

        if (target) {
            target.focus();
        } else {
            active.blur();
        }
    });
};

/**
 * Aceptar valida y cierra.
 *
 * Antes esto era además el único lugar donde se habilitaba el botón "Facturar"
 * (`invoiceConfigIsValidated = true`): sin abrir y cerrar el drawer, el botón
 * quedaba deshabilitado para siempre y sin explicar por qué. La habilitación ahora
 * se deriva del estado de la venta (`invoiceValidation`).
 */
const onClose = (e?: Event) => {
    e?.preventDefault?.();

    errors.value = {};

    if (validateForm()) {
        openDrawerDatosCliente.value = false;

        returnFocusAfterClose();
    }
};

/**
 * Deja el buscador listo para buscar y vacío.
 *
 * El drawer se abre con un cliente ya elegido en la venta (Consumidor Final), y mostrarlo
 * dentro del campo de búsqueda daba a entender que se estaba editando ese cliente. Ahora
 * el campo arranca vacío y con el foco, y el cliente de la venta se lee aparte, arriba.
 */
const prepareCustomerSearch = () => {
    searchCustomerRef.value?.reset?.();

    nextTick(() => {
        const input = searchCustomerRef.value?.$el?.querySelector('input') as HTMLInputElement | undefined;

        input?.focus();
    });
};

const afterVisibleChange = (visible: boolean) => {
    if (visible) {
        const date = dayjs(new Date());

        invoice.value.CbteFch = date.format('YYYYMMDD').toString();

        prepareCustomerSearch();
    }
};

watch(
    () => selectedCustomer,
    (newValue) => {
        invoice.value.customer = (newValue?.value ?? null) as never;
    },
    { deep: true },
);

const createSchema = (invoice: any) => {
    let schema = z.object({
        customer: z.preprocess(
            (value) => {
                return value ?? null;
            },
            z
                .union([
                    z.object({
                        value: z.number(),
                        label: z.string(),
                        cuit: z.number(),
                        afip_inscription: z.object({
                            id: z.number(),
                            name: z.string(),
                        }),
                        afip_document: z.object({
                            id: z.number(),
                            name: z.string(),
                            afip_code: z.string(),
                        }),
                    }),
                    z.null(),
                ])
                .refine((data) => data !== null, {
                    message: 'Buscar cliente es requerido',
                }),
        ),
        voucher: z.preprocess(
            (value) => {
                return value ?? null;
            },
            z.union([z.number(), z.null()]).refine((data) => data !== null, {
                message: 'Seleccionar tipo de comprobante es requerido',
            }),
        ),
        Concepto: z.preprocess(
            (value) => value ?? '',
            z.any().refine((data) => data !== null, {
                message: 'Concepto de facturación es requerido',
            }),
        ),
        date: z.preprocess(
            (value) => {
                return value ?? null;
            },
            z.any().refine((data) => data !== null, {
                message: 'Fecha Factura es requerida',
            }),
        ),
        SaleCondition: z.preprocess(
            (value) => value ?? '',
            z.any().refine((data) => data !== null, {
                message: 'La condición de venta es requerida',
            }),
        ),
        paymentType: z.preprocess(
            (value) => {
                return value ?? null;
            },
            z.union([z.number(), z.null()]).refine((data) => data !== null, {
                message: 'El modo de pago es requerido',
            }),
        ),
    });

    if (invoice.value.Concepto === '2' || invoice.value.Concepto === '3') {
        schema = schema.extend({
            FchServDesde: z.string().nonempty('Fecha de servicios desde es requerida'),
            dateVtoPago: z.preprocess(
                (value) => {
                    return value ?? null;
                },
                z.any().refine((data) => data !== null, {
                    message: 'La fecha de vencimiento de pago es requerida',
                }),
            ),
        });
    }

    return schema;
};

const validateForm = () => {
    const schema = createSchema(invoice);

    const result = schema.safeParse(invoice.value);

    if (!result.success) {
        errors.value = result.error.errors.reduce((acc, err) => {
            acc[err.path[0]] = err.message;
            return acc;
        }, {} as Record<string, string>);

        return false;
    }

    errors.value = {};

    return true;
};
</script>
<style scoped>
/* El drawer se teleporta fuera de la página del mostrador, así que acá no llegan las
   variables del tema: los valores van escritos, con los mismos tokens. */
.invoice-current-customer {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 6px;
    align-items: baseline;
    margin: 0 0 12px;
    padding: 8px 12px;
    font-size: 14px;
    color: #585858;
    background: #f8f9fb;
    border: 1px solid #f1f2f6;
    border-radius: 4px;
}

.invoice-current-customer b {
    font-weight: 600;
    color: #404040;
    overflow-wrap: anywhere;
}

.invoice-current-customer__note {
    color: #585858;
}

.invoice-customer-hint {
    margin: -12px 0 12px;
    font-size: 13px;
    line-height: 1.5;
    color: #585858;
}
</style>
