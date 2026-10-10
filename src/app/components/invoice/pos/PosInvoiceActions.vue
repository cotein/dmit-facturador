<template>
    <section class="pos-surface pos-doc" data-testid="pos-invoice-actions">
        <h2 class="pos-doc__title">Acciones del comprobante</h2>
        <p class="pos-doc__hint">
            Imprimir, pasar a PDF, mandarlo por email o sumarlo a MiPyme. Trabajan sobre el último comprobante emitido
            en esta sesión.
        </p>

        <div class="pos-doc__actions">
            <a-button data-action="print-invoice" @click="openExport('pdf')">Imprimir / PDF</a-button>
            <a-button data-action="email-invoice" @click="openExport('email')">Enviar por email</a-button>
            <a-button data-action="mipyme-invoice" @click="openMiPyme">MiPyme</a-button>
        </div>

        <div class="pos-doc__actions">
            <DrawerInvoiceComments />
        </div>

        <!-- Qué hay para imprimir o mandar, dicho en pantalla y no en un tooltip -->
        <p class="pos-doc__note" data-testid="pos-actions-state">{{ stateLine }}</p>

        <!-- Los contenedores del PDF tienen que existir para que el comprobante se
             pueda dibujar: viven acá, con las acciones que los usan. -->
        <Html2CanvasPdf />
        <ModalMiPyme />
        <DrawerSendEmail />
        <ExportEmailModal v-model:visible="exportOpen" :option="exportOption" :invoice="issuedPayload" />
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Html2CanvasPdf from '@/app/pdf/Html2CanvasPdf.vue';
import DrawerSendEmail from '@/app/componentsBase/email/DrawerSendEmail.vue';
import DrawerInvoiceComments from '../DrawerInvoiceComments.vue';
import ExportEmailModal from '../ExportEmailModal.vue';
import ModalMiPyme from '../ModalMiPyme.vue';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { useInvoiceCheckoutComposable } from '@/app/composables/invoice/useInvoiceCheckoutComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';

/**
 * Acciones del comprobante del modo normal.
 *
 * El modo normal es el que tiene las acciones sobre el papel: PDF/impresión,
 * exportar por email, comentarios de facturación y MiPyme. El mostrador no las
 * ofrece porque una venta de salón se cierra con el comprobante emitido.
 *
 * El PDF y el email necesitan un comprobante ya emitido —es lo que devuelve ARCA,
 * con su letra y su CAE— así que las dos acciones abren el mismo modal, que dice
 * en pantalla si todavía no hay nada que imprimir en vez de fallar al confirmar.
 * Los comentarios son el mismo `DrawerInvoiceComments` de siempre, con su botón.
 */
const { lastIssuedInvoice, lastIssuedInvoicePayload } = useInvoiceCheckoutComposable();
const { openModalMiPyme, TotalComprobante } = useInvoiceComposable();

const exportOpen = ref(false);
const exportOption = ref<'pdf' | 'email'>('pdf');

const issuedPayload = computed(() => lastIssuedInvoicePayload.value ?? null);

const stateLine = computed(() => {
    const issued = lastIssuedInvoice.value;

    if (!issued) {
        return `Todavía no emitiste un comprobante en esta sesión. Cuando factures ${formatCurrency(
            TotalComprobante.value,
        )} vas a poder imprimirlo, pasarlo a PDF o mandarlo por email desde acá.`;
    }

    if (issued.isMipyme) {
        return `${issued.comprobante}: falta la confirmación de MiPyme para tener el CAE.`;
    }

    return issued.cae === ''
        ? `${issued.comprobante}. ARCA todavía no devolvió el CAE.`
        : `${issued.comprobante} — CAE ${issued.cae} (vence ${issued.caeFchVto || '-'}).`;
});

const openExport = (option: 'pdf' | 'email') => {
    exportOption.value = option;
    exportOpen.value = true;
};

/** El modal de MiPyme es el mismo que abre solo ARCA cuando corresponde. */
const openMiPyme = () => {
    openModalMiPyme.value = true;
};
</script>
