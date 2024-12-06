<template>
    <a-row :gutter="30">
        <a-col :sm="24" :lg="6" :xs="24" :xl="12">
            <a-button type="primary" @click="showDrawer">
                <template #icon><PlusOutlined /></template>
                Datos del Cliente
            </a-button>
        </a-col>
        <a-drawer
            title="Datos del Cliente"
            :width="720"
            :visible="openDrawerDatosCliente"
            :body-style="{ paddingBottom: '80px' }"
            :footer-style="{ textAlign: 'right' }"
            :maskClosable="false"
            @close="onClose"
            @afterVisibleChange="afterVisibleChange"
        >
            <a-form :model="invoice" :rules="rules" layout="vertical" ref="invoiceConfigForm" @submit="onClose">
                <a-row :gutter="16">
                    <a-col :sm="24" :lg="24" :xs="24">
                        <a-form-item label="Buscar cliente" name="customer">
                            <SearchCustomer :context="'invoice'" />
                        </a-form-item>
                    </a-col>
                    <a-col :sm="24" :lg="24" :xs="24">
                        <a-form-item label="Seleccionar tipo de comprobante a relizar" name="voucher">
                            <VoucherSelect />
                        </a-form-item>
                    </a-col>
                    <a-col :sm="24" :lg="24" :xs="24">
                        <a-form-item label="Concepto de facturación" name="Concepto">
                            <a-radio-group v-model:value="invoice.Concepto" name="radioGroup">
                                <a-radio v-for="(item, index) in BillingConcepts" :key="index" :value="item.value">{{
                                    item.key
                                }}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item label="Fecha Factura" name="date">
                            <a-date-picker
                                v-model:value="invoice.date"
                                style="width: 100%"
                                showToday
                                format="DD-MM-YYYY"
                                placeholder="Fecha de factura"
                                @change="changeDate"
                                :disabled-date="disabledDate"
                            />
                        </a-form-item>
                    </a-col>

                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item label="Condición de venta" name="SaleCondition">
                            <SaleCondition />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item label="Modo de pago" name="paymentType">
                            <PaymentTypes />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16" v-if="invoice.Concepto != '1'">
                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item label="Fecha Servicios" name="servicesDate">
                            <a-range-picker
                                style="width: 100%"
                                :format="dateFormat"
                                v-model:value="serviceDate"
                                :placeholder="['Fecha inicial', 'Fecha final']"
                                @change="servDatesMethod"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item label="Fecha vencimiento de pago" name="FchVtoPago">
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
                <a-space>
                    <a-button @click="onCloseCancel">Cancelar</a-button>
                    <a-button type="primary" @click="onClose">Aceptar</a-button>
                </a-space>
            </a-form>
            <template #extra> </template>
        </a-drawer>
        <a-col :sm="24" :lg="6" :xs="24">
            <DrawerAddCustomer />
        </a-col>
    </a-row>
</template>
<script setup lang="ts">
import { BillingConcepts } from '@/app/types/Afip';
import { onMounted, ref, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useCustomerComposable } from '@/app/composables/customer/useCustomerComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import dayjs from 'dayjs';
import DrawerAddCustomer from '../customer/DrawerAddCustomer.vue';
import moment from 'moment';
import SaleCondition from './SaleCondition.vue';
import SearchCustomer from '../customer/SearchCustomer.vue';
import type { Dayjs } from 'dayjs';
import VoucherSelect from './VoucherSelect.vue';
import PaymentTypes from '@/app/components/paymentType/PaymentTypes.vue';
import type { Rule } from 'ant-design-vue/lib/form';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';

const { openDrawerDatosCliente } = useVisibleComposable();

const { selectedCustomer } = useCustomerComposable();

const { invoice, invoiceConfigIsValidated } = useInvoiceComposable();

const { CompanyGetter } = useCompanyComposable();

const invoiceConfigForm = ref();

// Agrega un cero al inicio del número si es menor a 10
const appendZero = function (number: number) {
    return Number(number) < 10 ? '0' + number : number;
};

const dateFormat = 'DD-MM-YYYY';

const serviceDate = ref<[Dayjs, Dayjs]>([dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]);

const invoiceDateValidator = (rule: Rule, value: any) => {
    return new Promise((resolve, reject) => {
        if (value === null) {
            reject('La fecha del comprobante no puede estar vacía');
        } else {
            resolve(true);
        }
    });
};

const invoiceVoucherValidator = (rule: Rule, value: any) => {
    return new Promise((resolve, reject) => {
        if (value === null) {
            reject('Debe seleccionar un comprobante a emitir');
        } else {
            resolve(true);
        }
    });
};

const vtoPagoValidator = (rule: Rule, value: Dayjs) => {
    return new Promise((resolve, reject) => {
        if (invoice.value.Concepto === '2' || invoice.value.Concepto === '3') {
            if (value) {
                resolve(true);
            } else {
                reject('Si la factura es de servicios, la fecha de vencimiento de pago es requerida');
            }
        }
    });
};

const rules = ref({
    Concepto: [{ required: true, message: 'Debe seleccionar un concepto de facturación' }],
    customer: [{ required: true, message: 'Debe buscar un cliente' }],
    SaleCondition: [{ required: true, message: 'La condición de venta es requerida' }],
    voucher: [
        {
            required: true,
            validator: invoiceVoucherValidator,
        },
    ],
    //type_details: [{ required: true, message: 'Debe seleccionar el tipo de detalle de la factura' }],
    FchVtoPago: [
        {
            validator: vtoPagoValidator,
        },
    ],
    paymentType: [{ required: true, message: 'El modo de pago es requerido' }],
    date: [
        {
            required: true,
            validator: invoiceDateValidator,
        },
    ],
});

const onCloseCancel = () => (openDrawerDatosCliente.value = false);

const onClose = async (e: Event) => {
    const isValid = await invoiceConfigForm.value.validate().catch((error: any) => {
        invoiceConfigIsValidated.value = false;
        return false;
    });

    if (isValid) {
        invoiceConfigIsValidated.value = true;
        openDrawerDatosCliente.value = false;
    } else {
        invoiceConfigIsValidated.value = false;
    }
};

const showDrawer = () => {
    openDrawerDatosCliente.value = true;
};

const afterVisibleChange = (visible: boolean) => {
    if (visible) {
        const date = dayjs(new Date());

        invoice.value.date = date;

        invoice.value.CbteFch = date.format('YYYYMMDD').toString();
    }
};
const formatDate = (dateObj: any) => {
    const day = dateObj.$D < 10 ? `0${dateObj.$D}` : `${dateObj.$D}`;
    const month = dateObj.$M + 1 < 10 ? `0${dateObj.$M + 1}` : `${dateObj.$M + 1}`;
    const year = dateObj.$y;
    return `${year}${month}${day}`;
};

const servDatesMethod = (date: any) => {
    if (date && date.length >= 2) {
        // Asumiendo que date[0] es la fecha de inicio y date[1] es la fecha de fin
        invoice.value.FchServDesde = formatDate(date[0]);
        invoice.value.FchServHasta = formatDate(date[1]);
    } else {
        invoice.value.FchServDesde = '';
        invoice.value.FchServHasta = '';
    }
};

const disabledDate = (current: any) => {
    // Asumiendo que invoice es accesible en este contexto
    const concepto = invoice.value.Concepto;
    let daysRange;

    // Determinar el rango de días basado en el valor de Concepto
    if (concepto === '1') {
        daysRange = 5;
    } else if (concepto === '2' || concepto === '3') {
        daysRange = 10;
    } else {
        // Si Concepto no es '1', '2', o '3', usar un rango por defecto (opcional)
        daysRange = 0;
    }

    // Verificar si invoice.value.date es undefined y establecer una fecha base
    const invoiceDate = invoice.value.date ? new Date(invoice.value.date.$d) : new Date();
    const baseDate = concepto === '1' ? new Date() : invoiceDate;

    // Calcular las fechas límite
    const beforeDate = new Date(baseDate);
    beforeDate.setDate(beforeDate.getDate() - daysRange - 1);
    let afterDate = new Date(baseDate);
    afterDate.setDate(afterDate.getDate() + daysRange);

    // Asegurar que la fecha seleccionada no pase al mes siguiente
    // Obtener el último día del mes actual
    const lastDayOfCurrentMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);

    // Si concepto es '1', '2', o '3', ajustar afterDate para que no exceda el mes actual
    if (['1', '2', '3'].includes(concepto) && afterDate > lastDayOfCurrentMonth) {
        afterDate = lastDayOfCurrentMonth;
    }

    // Deshabilitar fechas fuera del rango calculado
    return current < beforeDate || current > afterDate;
};

const setDate = (date: any) => {
    let day = null;

    if (date.$D < 10) {
        day = '0' + date.$D;
    } else {
        day = date.$D;
    }

    if (date.$M + 1 < 10) {
        invoice.value.CbteFch = `${date.$y}0${date.$M + 1}${day}`;
    } else {
        invoice.value.CbteFch = `${date.$y}${date.$M + 1}${day}`;
    }
};

const servicesDateFchVtoPago = (date: any) => {
    let day = null;

    if (date.$D < 10) {
        day = '0' + date.$D;
    } else {
        day = date.$D;
    }

    if (date.$M + 1 < 10) {
        invoice.value.FchVtoPago = `${date.$y}0${date.$M + 1}${day}`;
    } else {
        invoice.value.FchVtoPago = `${date.$y}${date.$M + 1}${day}`;
    }
};
const changeDate = (date: any) => {
    setDate(date);
};

watch(
    () => selectedCustomer,
    (newValue) => {
        invoice.value.customer = newValue.value;
    },
    { deep: true },
);

watch(
    () => invoice.value.Concepto,
    (newValue) => {
        if (newValue === '2' || newValue === '3') {
            const d = dayjs(new Date());

            serviceDate.value[0] = d.subtract(1, 'month').startOf('M');

            serviceDate.value[1] = d.subtract(1, 'month').endOf('M');

            invoice.value.FchServDesde = d.subtract(1, 'month').startOf('M').format('YYYYMMDD').toString();

            invoice.value.FchServHasta = d.subtract(1, 'month').endOf('M').format('YYYYMMDD').toString();

            invoice.value.FchVtoPago = d.add(invoice.value.SaleCondition.days, 'day').format('YYYYMMDD').toString();
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
        const date = dayjs(new Date());
        //fchVtoPago.value = date.add(newValue.days, 'day');
    },
    { immediate: true },
);

onMounted(() => {
    const date = moment();

    if (CompanyGetter.value) {
        if (invoice && invoice.value) {
            invoice.value.Concepto = String(CompanyGetter!.value.billing_concept);
            invoice.value.company_id = CompanyGetter!.value.id;
            invoice.value.PtoVta = Number(CompanyGetter!.value.pto_vta_fe);

            let day = null;

            if (date.date() < 10) {
                day = '0' + date.date();
            } else {
                day = date.date();
            }

            if (date.month() + 1 < 10) {
                invoice.value.CbteFch = `${date.year()}0${date.month() + 1}${day}`;
            } else {
                invoice.value.CbteFch = `${date.year()}${date.month() + 1}${day}`;
            }
        }
    }
});
</script>
