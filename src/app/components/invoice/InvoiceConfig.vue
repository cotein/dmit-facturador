<template>
    <a-row :gutter="30" class="scale-down">
        <a-col :sm="24" :lg="6" :xs="24" :xl="12" class="center-buttons">
            <a-button type="primary" @click="showDrawer">
                <template #icon><PlusOutlined /></template>
                Buscar cliente ya ingresado
            </a-button>
        </a-col>
        <a-drawer
            title="Datos del Cliente"
            :width="drawerWidth"
            :visible="openDrawerDatosCliente"
            :body-style="{ paddingBottom: '80px' }"
            :footer-style="{ textAlign: 'right' }"
            :maskClosable="false"
            @close="onClose"
            @afterVisibleChange="afterVisibleChange"
        >
            <a-form :model="invoice" layout="vertical" ref="invoiceConfigForm" @submit="onClose">
                <a-row :gutter="16">
                    <a-col :sm="24" :lg="24" :xs="24">
                        <a-form-item
                            label="Buscar cliente"
                            name="customer"
                            :validate-status="errors.customer ? 'error' : ''"
                            :help="errors.customer"
                        >
                            <SearchCustomer :context="'invoice'" :multiple="false" ref="searchCustomerRef" />
                        </a-form-item>
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
                    <a-col :sm="24" :lg="24" :xs="24">
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
                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item
                            label="Fecha Factura"
                            name="date"
                            :validate-status="errors.date ? 'error' : ''"
                            :help="errors.date"
                        >
                            <a-date-picker
                                v-model:value="invoice.date"
                                style="width: 100%"
                                showToday
                                format="DD-MM-YYYY"
                                placeholder="Fecha de factura"
                                @change="setInvoiceDate"
                                :disabled-date="disabledDate"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item
                            label="Condición de venta"
                            name="SaleCondition"
                            :validate-status="errors.SaleCondition ? 'error' : ''"
                            :help="errors.SaleCondition"
                        >
                            <SaleCondition />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :lg="12" :sm="24" :xs="24">
                        <a-form-item
                            label="Modo de pago"
                            name="paymentType"
                            :validate-status="errors.paymentType ? 'error' : ''"
                            :help="errors.paymentType"
                        >
                            <a-select
                                v-model="defaultPaymentType"
                                placeholder="Modo de pago"
                                style="width: 100%"
                                :default-active-first-option="true"
                                :field-names="{ label: 'name', value: 'id' }"
                                :options="PaymentTypesGetter"
                                @change="handleChangePaymentType"
                            ></a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16" v-if="invoice.Concepto != '1'">
                    <a-col :lg="12" :sm="24" :xs="24">
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
                    <a-col :lg="12" :sm="24" :xs="24">
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
                <a-space>
                    <a-button @click="onCloseCancel">Cancelar</a-button>
                    <a-button type="primary" @click="onClose">Aceptar</a-button>
                </a-space>
            </a-form>
            <template #extra> </template>
        </a-drawer>
        <a-col :sm="24" :lg="6" :xs="24" class="center-buttons">
            <DrawerAddCustomer />
        </a-col>
    </a-row>
</template>
<script setup lang="ts">
import { BillingConcepts } from '@/app/types/Afip';
import { onMounted, ref, watch, computed, nextTick } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useCustomerComposable } from '@/app/composables/customer/useCustomerComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import DrawerAddCustomer from '../customer/DrawerAddCustomer.vue';
import SaleCondition from './SaleCondition.vue';
import SearchCustomer from '../customer/SearchCustomer.vue';
import VoucherSelect from './VoucherSelect.vue';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import { z } from 'zod';
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';
import { useMediaQueryComposable } from '@/app/composables/mediaQuery.ts/useMediaQueryComposable';

const { drawerWidth } = useMediaQueryComposable();

const { PaymentTypesGetter } = usePaymentTypeComposable();

const errors = ref<Record<string, string | undefined>>({});

const searchCustomerRef = ref<any>(null);

const { openDrawerDatosCliente } = useVisibleComposable();

const { selectedCustomer } = useCustomerComposable();

const { invoice, invoiceConfigIsValidated, invoiceInitialStatus } = useInvoiceComposable();

const { CompanyGetter } = useCompanyComposable();

const invoiceConfigForm = ref();

const dateFormat = 'DD-MM-YYYY';

const serviceDate = ref<[Dayjs, Dayjs]>([dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]);

const onCloseCancel = () => {
    errors.value = {};
    openDrawerDatosCliente.value = false;
    invoiceInitialStatus();
};

const onClose = (e: Event) => {
    errors.value = {};

    const isValid = validateForm();

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
        console.log('🚀 ~ nextTick ~ searchCustomerInput:', searchCustomerRef.value?.$el);
        // Focus the SearchCustomer component
        nextTick(() => {
            const searchCustomerInput = searchCustomerRef.value?.$el.querySelector('input');
            if (searchCustomerInput) {
                searchCustomerInput.focus();
            }
        });
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

const setLastDayOfMonth = () => {
    const lastDay = dayjs().endOf('month').format('YYYYMMDD');
    invoice.value.FchVtoPago = lastDay;
};
const servicesDateFchVtoPago = () => {
    setLastDayOfMonth();
};

const setInvoiceDate = (date: Dayjs) => {
    const formattedDate = dayjs(date).format('YYYYMMDD');
    invoice.value.CbteFch = formattedDate;
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
        const d = dayjs();

        if (newValue === '2' || newValue === '3') {
            const lastMonthStart = d.subtract(1, 'month').startOf('month');
            const lastMonthEnd = d.subtract(1, 'month').endOf('month');
            const paymentDueDate = d.add(invoice.value.SaleCondition.days, 'day');

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
        const date = dayjs(new Date());
        //fchVtoPago.value = date.add(newValue.days, 'day');
    },
    { immediate: true },
);

onMounted(() => {
    const date = dayjs();

    if (CompanyGetter.value) {
        if (invoice && invoice.value) {
            invoice.value.Concepto = String(CompanyGetter!.value.billing_concept);
            invoice.value.company_id = CompanyGetter!.value.id;
            invoice.value.PtoVta = Number(CompanyGetter!.value.pto_vta_fe);

            invoice.value.CbteFch = date.format('YYYYMMDD');
        }
    }
});

const handleChangePaymentType = (value: any) => {
    console.log('🚀 ~ handleChangePaymentType ~ value:', value);
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

/* const isMobile = () => {
    return window.matchMedia('(max-width: 768px)').matches;
}; */
</script>
<style scoped>
@media (max-width: 1280px) and (max-height: 768px) {
    .scale-down {
        transform: scale(0.95);
        transform-origin: top left;
        font-size: small;
    }
    .center-buttons {
        display: flex;
        justify-content: center;
        margin: 1rem;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .center-buttons {
        flex: 1 1 50%;
        font-size: 0.8rem;
        margin-bottom: 2rem;
    }
}
</style>
