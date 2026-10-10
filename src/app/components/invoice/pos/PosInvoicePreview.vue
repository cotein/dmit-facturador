<template>
    <section class="pos-surface pos-doc" data-testid="pos-invoice-preview">
        <h2 class="pos-doc__title">Vista previa del comprobante</h2>
        <p class="pos-doc__hint">
            Así sale el comprobante con lo que llevás cargado. Se arma con el tipo de comprobante, la fecha, el concepto
            y el cliente que elijas.
        </p>

        <InvoiceLetterBox class="pos-doc__preview">
            <div class="invoice-letter-inner">
                <a-row align="middle">
                    <a-col :xs="24" :sm="24">
                        <article class="invoice-author">
                            <h3 class="invoice-author__title" data-testid="pos-preview-voucher">{{ voucherName }}</h3>
                            <p data-testid="pos-preview-date">Fecha factura: {{ voucherDate }}</p>
                            <p data-testid="pos-preview-concept">{{ conceptLine }}</p>
                        </article>
                    </a-col>
                    <a-col :xs="24" :sm="24">
                        <address class="invoice-customer">
                            <h3 class="invoice-customer__title">Facturar a:</h3>
                            <p data-testid="pos-preview-customer">{{ customerLabel }}</p>
                        </address>
                    </a-col>
                </a-row>
            </div>
        </InvoiceLetterBox>

        <div class="pos-doc__meta">
            <AditionalPayment />
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { InvoiceLetterBox } from '../Style';
import AditionalPayment from '../AditionalPayment.vue';
import { BillingConcepts } from '@/app/types/Afip';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useVoucherStore } from '@/app/store/voucher/useVoucherStore';
import type { PosVoucher } from '@/app/composables/invoice/usePosSaleComposable';

/**
 * Vista previa del comprobante del modo normal.
 *
 * Es el facsímil que el modo normal siempre mostró arriba de la tabla —letra del
 * comprobante, fecha de factura, concepto y a quién se factura— ahora como una
 * superficie más de la misma pantalla que comparten los dos modos: el mostrador no
 * la muestra porque su pantalla está pensada para el salón, no para revisar el
 * papel antes de emitir.
 *
 * Sale tal cual del estado de la venta (`invoice`), así que sigue a los campos de
 * configuración sin que nadie tenga que sincronizar nada.
 */
const { InvoiceGetter } = useInvoiceComposable();

const { Vouchers } = storeToRefs(useVoucherStore());

const voucherDate = computed(() => {
    const date = InvoiceGetter.value.CbteFch;

    if (!date) {
        return '';
    }

    const day = String(date).substring(6, 8);
    const month = String(date).substring(4, 6);
    const year = String(date).substring(0, 4);

    return `${day}-${month}-${year}`;
});

const voucherName = computed(() => {
    const vouchers = (Vouchers.value ?? []) as unknown as PosVoucher[];
    const voucher = vouchers.find((item) => Number(item.id) === Number(InvoiceGetter.value.voucher));

    return voucher?.name ?? '';
});

const customerLabel = computed(() => (InvoiceGetter.value.customer as { label?: string } | null)?.label ?? '');

/**
 * Concepto y, cuando se factura servicios, el período facturado.
 *
 * Antes leía `BillingConcepts[Concepto - 1].key` sin guarda: con el concepto vacío
 * —que es el estado inicial de la venta— el `.key` de `undefined` rompía el render
 * de la vista previa entera.
 */
const conceptLine = computed(() => {
    const concept = InvoiceGetter.value.Concepto;
    const index = Number(concept) - 1;
    const label = BillingConcepts[index]?.key ?? '';

    if (label === '' || !InvoiceGetter.value.CbteNro) {
        return '';
    }

    if (InvoiceGetter.value.Concepto === '1' || !InvoiceGetter.value.FchServDesde) {
        return label;
    }

    const from = dayjs(InvoiceGetter.value.FchServDesde, 'YYYYMMDD').format('DD/MM/YYYY');
    const to = dayjs(InvoiceGetter.value.FchServHasta, 'YYYYMMDD').format('DD/MM/YYYY');

    return `${label} - Desde: ${from} Hasta: ${to}`;
});
</script>
