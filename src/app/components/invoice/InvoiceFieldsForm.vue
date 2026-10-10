<template>
    <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :lg="24">
            <a-form-item
                label="Concepto de facturación"
                name="Concepto"
                :validate-status="errors.Concepto ? 'error' : ''"
                :help="errors.Concepto"
            >
                <a-radio-group v-model:value="invoice.Concepto" name="radioGroup">
                    <a-radio v-for="(item, index) in BillingConcepts" :key="index" :value="item.value">{{
                        item.key
                    }}</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-col>
    </a-row>

    <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :lg="columns === 2 ? 12 : 24">
            <a-form-item
                label="Fecha Factura"
                name="date"
                :validate-status="errors.date ? 'error' : ''"
                :help="errors.date"
            >
                <a-date-picker
                    v-model:value="invoice.date"
                    style="width: 100%"
                    format="DD-MM-YYYY"
                    placeholder="Fecha de factura"
                    data-field="invoice-date"
                    @change="setInvoiceDate"
                    :disabled-date="disabledDate"
                />
            </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :lg="columns === 2 ? 12 : 24">
            <a-form-item
                label="Condición de venta"
                name="SaleCondition"
                :validate-status="errors.SaleCondition ? 'error' : ''"
                :help="errors.SaleCondition"
            >
                <SaleCondition />
            </a-form-item>

            <!--
                Alta al vuelo, para esta venta: la condición escrita acá queda elegida.
                Va fuera del `a-form-item` a propósito: un `Form.Item` recolecta un solo
                campo y, adentro, estos campos le hacían avisar por consola.
            -->
            <PosInlineOption
                trigger-label="Nueva condición de venta"
                name-label="Nombre de la condición"
                placeholder="Por ejemplo: Transferencia 48 h"
                announce-label="Condición de venta"
                action-name="add-sale-condition"
                test-id="sale-condition-inline"
                with-days
                @create="createCondition"
            />
        </a-col>
    </a-row>

    <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :lg="columns === 2 ? 12 : 24">
            <a-form-item
                label="Modo de pago"
                name="paymentType"
                :validate-status="errors.paymentType ? 'error' : ''"
                :help="errors.paymentType"
            >
                <a-select
                    v-model:value="defaultPaymentType"
                    placeholder="Modo de pago"
                    style="width: 100%"
                    :default-active-first-option="true"
                    :field-names="{ label: 'name', value: 'id' }"
                    :options="allPaymentTypes"
                    data-field="payment-type"
                    data-testid="payment-type-select"
                    @change="handleChangePaymentType"
                ></a-select>
            </a-form-item>

            <!-- Alta al vuelo, para esta venta: el modo de pago escrito acá queda elegido. -->
            <PosInlineOption
                trigger-label="Nuevo modo de pago"
                name-label="Nombre del modo de pago"
                placeholder="Por ejemplo: Transferencia 48 h"
                announce-label="Modo de pago"
                action-name="add-payment-type"
                test-id="payment-type-inline"
                @create="createPayment"
            />
        </a-col>
    </a-row>

    <a-row :gutter="16" v-if="invoice.Concepto != '1'">
        <a-col :xs="24" :sm="24" :lg="columns === 2 ? 12 : 24">
            <a-form-item
                label="Fecha Servicios"
                name="servicesDate"
                :validate-status="errors.FchServDesde ? 'error' : ''"
                :help="errors.FchServDesde"
            >
                <a-range-picker
                    style="width: 100%"
                    :format="dateFormat"
                    v-model:value="serviceDate"
                    :placeholder="['Fecha inicial', 'Fecha final']"
                    @change="servDatesMethod"
                />
            </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :lg="columns === 2 ? 12 : 24">
            <a-form-item
                label="Fecha vencimiento de pago"
                name="FchVtoPago"
                :validate-status="errors.dateVtoPago ? 'error' : ''"
                :help="errors.dateVtoPago"
            >
                <a-date-picker
                    v-model:value="invoice.dateVtoPago"
                    style="width: 100%"
                    showToday
                    :format="dateFormat"
                    placeholder="Vencimiento de pago"
                    @change="servicesDateFchVtoPago"
                />
            </a-form-item>
        </a-col>
    </a-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { BillingConcepts } from '@/app/types/Afip';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePosInlineOptions } from '@/app/composables/invoice/usePosInlineOptions';
import PosInlineOption from './pos/PosInlineOption.vue';
import SaleCondition from './SaleCondition.vue';

/**
 * Campos del comprobante que no son ni el cliente ni el tipo de comprobante:
 * concepto, fecha de factura, condición de venta, modo de pago y —cuando el
 * concepto factura servicios— las fechas de servicio y de vencimiento de pago.
 *
 * Salieron de `InvoiceConfig.vue` para que el modo mostrador pueda mostrarlos
 * dentro de "Más opciones" con la misma lógica y sin duplicarla: si se cambia una
 * regla de fechas acá, cambia en los dos lados.
 */
type Props = {
    /** 2 columnas en el drawer del modo normal, 1 en el panel angosto del mostrador. */
    columns?: 1 | 2;
    errors?: Record<string, string | undefined>;
};

withDefaults(defineProps<Props>(), {
    columns: 2,
    errors: () => ({}),
});

const { allPaymentTypes, allSaleConditions, createPaymentType, createSaleCondition } = usePosInlineOptions();

const { invoice } = useInvoiceComposable();

const dateFormat = 'DD-MM-YYYY';

const serviceDate = ref<[Dayjs, Dayjs]>([dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]);

const formatDate = (dateObj: any) => {
    const day = dateObj.$D < 10 ? `0${dateObj.$D}` : `${dateObj.$D}`;
    const month = dateObj.$M + 1 < 10 ? `0${dateObj.$M + 1}` : `${dateObj.$M + 1}`;
    const year = dateObj.$y;

    return `${year}${month}${day}`;
};

const servDatesMethod = (date: any) => {
    if (date && date.length >= 2) {
        invoice.value.FchServDesde = formatDate(date[0]);
        invoice.value.FchServHasta = formatDate(date[1]);
    } else {
        invoice.value.FchServDesde = '';
        invoice.value.FchServHasta = '';
    }
};

const disabledDate = (current: any) => {
    const concepto = invoice.value.Concepto;
    let daysRange;

    if (concepto === '1') {
        daysRange = 5;
    } else if (concepto === '2' || concepto === '3') {
        daysRange = 10;
    } else {
        daysRange = 0;
    }

    const invoiceDate = invoice.value.date ? new Date((invoice.value.date as any).$d) : new Date();
    const baseDate = concepto === '1' ? new Date() : invoiceDate;

    const beforeDate = new Date(baseDate);
    beforeDate.setDate(beforeDate.getDate() - daysRange - 1);

    let afterDate = new Date(baseDate);
    afterDate.setDate(afterDate.getDate() + daysRange);

    const lastDayOfCurrentMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

    if (['1', '2', '3'].includes(concepto) && afterDate > lastDayOfCurrentMonth) {
        afterDate = lastDayOfCurrentMonth;
    }

    return current < beforeDate || current > afterDate;
};

const setLastDayOfMonth = () => {
    invoice.value.FchVtoPago = dayjs().endOf('month').format('YYYYMMDD');
};

const servicesDateFchVtoPago = () => {
    setLastDayOfMonth();
};

const setInvoiceDate = (date: Dayjs) => {
    invoice.value.CbteFch = dayjs(date).format('YYYYMMDD');
};

const handleChangePaymentType = (value: any) => {
    invoice.value.paymentType = value;
};

const defaultPaymentType = computed({
    get() {
        return invoice.value.paymentType;
    },
    set(val) {
        invoice.value.paymentType = val;
    },
});

/** La condición recién creada queda elegida en la venta: se crea para usarla ya. */
const createCondition = ({ name, days }: { name: string; days: number }) => {
    const created = createSaleCondition(name, days);

    invoice.value.SaleCondition = created.id;
};

/**
 * El modo de pago recién escrito queda elegido en la venta: se crea para usarlo ya.
 */
const createPayment = ({ name }: { name: string; days: number }) => {
    const created = createPaymentType(name);

    invoice.value.paymentType = created.id;
};

watch(
    () => invoice.value.Concepto,
    (newValue) => {
        const d = dayjs();

        if (newValue === '2' || newValue === '3') {
            const lastMonthStart = d.subtract(1, 'month').startOf('month');
            const lastMonthEnd = d.subtract(1, 'month').endOf('month');
            const saleConditionDays = Number((invoice.value.SaleCondition as any)?.days ?? 0);
            const paymentDueDate = d.add(saleConditionDays, 'day');

            serviceDate.value[0] = lastMonthStart;
            serviceDate.value[1] = lastMonthEnd;

            invoice.value.FchServDesde = lastMonthStart.format('YYYYMMDD');
            invoice.value.FchServHasta = lastMonthEnd.format('YYYYMMDD');
            invoice.value.FchVtoPago = paymentDueDate.format('YYYYMMDD');
        } else {
            invoice.value.FchServDesde = '';
            invoice.value.FchServHasta = '';
            invoice.value.FchVtoPago = '';
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => invoice.value.SaleCondition,
    (newValue) => {
        // Incluye las condiciones creadas a mano para esta venta: sin eso, la condición
        // nueva quedaba elegida pero el vencimiento de pago no la seguía.
        const sc = allSaleConditions.value.find((saleCondition) => saleCondition.id === newValue);

        if (sc) {
            const date = dayjs(new Date());

            invoice.value.FchVtoPago = date.add(sc.days, 'day').format('YYYYMMDD');
            invoice.value.dateVtoPago = date.add(sc.days, 'day');
        }
    },
    { immediate: true },
);
</script>
