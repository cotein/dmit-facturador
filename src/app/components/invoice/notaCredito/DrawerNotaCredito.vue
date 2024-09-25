<template>
    <a-drawer
        :title="titleNotaCredito"
        width="75%"
        :visible="openDrawerNotaCredito"
        @close="onClose"
        :bodyStyle="bodyStyle"
        :footer-style="footerStyle"
        :maskClosable="false"
    >
        <template #extra>
            <a-date-picker
                v-model:value="notUse"
                size="small"
                style="margin-right: 2rem"
                placeholder="Fecha Nota de crédito"
                :disabled-date="disabledDate"
                format="DD-MM-YYYY"
                @change="changeDate"
            />
            <a-button style="margin-right: 8px" @click="onClose">Cancelar</a-button>
            <a-button type="primary" @click="generate" :loading="spinner" :disabled="!productsForNotaCredito.length"
                >Generar</a-button
            >
        </template>
        <InvoiceLetterBox>
            <div class="invoice--header">
                <a-row align="middle" justify="space-around">
                    <a-col :lg="12" :xs="24">
                        <address class="invoice-customer">
                            <sdHeading class="invoice-customer__title" as="h5"> Facturar a: </sdHeading>
                            <p>
                                {{ invoiceForNotaCredito?.customer.name }}
                                {{ invoiceForNotaCredito?.customer.last_name }}<br />
                                <template v-if="invoiceForNotaCredito?.customer.fantasy_name">
                                    {{ invoiceForNotaCredito?.customer.fantasy_name }}
                                </template>
                                <br />
                                {{ invoiceForNotaCredito?.customer.afipDocument }} :
                                {{ invoiceForNotaCredito?.customer.cuit }}
                            </p>
                        </address>
                    </a-col>

                    <a-col :lg="12" :xs="24">
                        <sdHeading class="invoice-customer__title" as="h5">
                            Sobre: {{ invoiceForNotaCredito?.voucher!.name }}
                            {{ invoiceForNotaCredito?.voucher!.pto_vta }}-{{
                                invoiceForNotaCredito?.voucher!.cbte_desde
                            }}
                        </sdHeading>
                    </a-col>
                </a-row>
            </div>
        </InvoiceLetterBox>
        <InvoiceHasNotaCredito :children="invoiceForNotaCredito?.voucher!.children" />
        <div class="invoice--body">
            <p>Detalle de la factura</p>
            <a-table
                :columns="columns"
                :data-source="invoiceForNotaCredito?.items"
                :pagination="false"
                :rowSelection="rowSelection"
            >
                <template #headerCell="{ title }">
                    <div style="text-align: center">{{ title }}</div>
                </template>
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'name'">
                        {{ record.name }}
                    </template>
                    <template v-if="column.key === 'unit_price'">
                        {{ $filters.formatCurrency(parseFloat(record.unit_price)) }}
                    </template>
                    <template v-if="column.key === 'quantity'">
                        <!-- <QuantityProductNotaCredito :record="record" :index="index" /> -->
                        {{ record.quantity }}
                    </template>
                    <template v-if="column.key === 'neto'">
                        {{ $filters.formatCurrency(record.neto_import) }}
                    </template>
                    <template v-if="column.key === 'iva'">
                        {{ $filters.formatCurrency(record.iva_import) }}
                    </template>
                    <template v-if="column.key === 'percep_iibb_import'">
                        {{ `${record.percep_iibb_alicuota} % | ${$filters.formatCurrency(record.percep_iibb_import)}` }}
                    </template>
                    <template v-if="column.key === 'percep_iva_import'">
                        {{ `${record.percep_iva_alicuota} % | ${$filters.formatCurrency(record.percep_iva_import)}` }}
                    </template>
                    <template v-if="column.key === 'total'">
                        {{
                            $filters.formatCurrency(record.total + record.percep_iibb_import + record.percep_iva_import)
                        }}
                    </template>
                </template>
            </a-table>
        </div>
        <template #footer>
            <sdHeading class="invoice-customer__title" as="h5">
                Se va a generar una Nota de Crédito por :
                {{ $filters.formatCurrency(totalNotaCredito) }}</sdHeading
            >
        </template>
        <ProductsWillBeBillTable />
    </a-drawer>
</template>
<script setup lang="ts">
import { FECompUltimoAutorizado } from '@/api/afip/afip-factura-electronica';
import { ref, onMounted, watch } from 'vue';
import { SELECT_INVOICE_TYPE } from '@/app/types/Constantes';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import dayjs, { Dayjs } from 'dayjs';
import InvoiceHasNotaCredito from '@/app/components/invoice/notaCredito/InvoiceHasNotaCredito.vue';
import ProductsWillBeBillTable from '@/app/components/invoice/notaCredito/ProductsWillBeBillTable.vue';
import type { ProductForNotaCredito } from '@/app/types/Product';

const { CompanyGetter } = useCompanyComposable();
const { invoice, createInvoiceMutation } = useInvoiceComposable();
const { openDrawerNotaCredito, invoiceForNotaCredito, titleNotaCredito, productsForNotaCredito, totalNotaCredito } =
    useInvoiceNotaCreditoComposable();

const { createInvoiceBuilder, createConcreteInvoiceBuilder } = useInvoiceBuilderComposable();

const onClose = () => {
    openDrawerNotaCredito.value = false;
    invoiceForNotaCredito.value = undefined;
    productsForNotaCredito.value = [];
};

const notUse = ref(dayjs(new Date()));

const disabledDate = (current: Dayjs) => {
    let days = 10;

    if (invoiceForNotaCredito.value?.voucher!.concepto === 1) days = 5;

    return (current && current < dayjs().subtract(days, 'day')) || current > dayjs().add(days, 'day');
};

const changeDate = (date: Dayjs) => {
    if (date) {
        invoice.value.CbteFch = date.format('YYYYMMDD');
    } else {
        invoice.value.CbteFch = '';
    }
};

watch(
    () => invoice.value.CbteFch,
    () => {
        const d = dayjs(new Date());
        invoice.value.CbteFch = d.format('YYYYMMDD');
    },
    { immediate: true },
);

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: ProductForNotaCredito[]) => {
        console.log('🚀 ~onChange selectedRows:', selectedRows);
        productsForNotaCredito.value = selectedRows;
    },
    onSelect: (record: ProductForNotaCredito, selected: boolean, selectedRows: ProductForNotaCredito[]) => {
        productsForNotaCredito.value = selectedRows;
    },
    onSelectAll: (selected: boolean, selectedRows: ProductForNotaCredito[], changeRows: ProductForNotaCredito[]) => {
        console.log('🚀 ~ onSelectAll selectedRows:', selectedRows);
        productsForNotaCredito.value = selectedRows;
    },
    getCheckboxProps: (record: ProductForNotaCredito) => {
        return {
            disabled: disableCheckbox(record),
        };
    },
};

const columns = [
    {
        title: '#',
        dataIndex: 'row',
        key: 'row',
    },
    {
        title: 'Producto',
        dataIndex: 'name',
        key: 'name',
        align: 'left',
    },
    {
        title: 'Precio/U',
        dataIndex: 'unit_price',
        key: 'unit_price',
        align: 'right',
    },
    {
        title: 'Cantidad',
        dataIndex: 'quantity',
        key: 'quantity',
        align: 'center',
    },
    {
        title: 'Neto',
        dataIndex: 'neto',
        key: 'neto',
        align: 'right',
    },
    {
        title: 'Iva',
        dataIndex: 'iva',
        key: 'iva',
        align: 'right',
    },
    {
        title: 'Percep. IIBB',
        dataIndex: 'iibb',
        key: 'percep_iibb_import',
        align: 'right',
    },
    {
        title: 'Percep. IVA',
        dataIndex: 'iva',
        key: 'percep_iva_import',
        align: 'right',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        align: 'right',
    },
];

const disableCheckbox = (record: ProductForNotaCredito): boolean => {
    let productInNotaCredito: number = 0;

    if (invoiceForNotaCredito.value?.voucher!.children.length) {
        const matchedItems = invoiceForNotaCredito.value.voucher.children
            .flatMap((invoice: any) => invoice.items)
            .filter((item) => record.name === item.name);

        productInNotaCredito = matchedItems.reduce((total, item) => total + item.quantity, 0);
    }

    if (productInNotaCredito < record.quantity) {
        return false;
    }

    return true;
};

const spinner = ref<boolean>(false);

const generate = async () => {
    spinner.value = true;

    let invoiceType: number = 0;

    titleNotaCredito.value === 'NOTA DE CRÉDITO'
        ? (invoiceType = invoiceForNotaCredito.value!.voucher.typeNotaCredito)
        : (invoiceType = invoiceForNotaCredito.value!.voucher.typeNotaDebito);

    const builder = createConcreteInvoiceBuilder(
        SELECT_INVOICE_TYPE[invoiceType],
        CompanyGetter.value!.inscription_id,
        invoiceForNotaCredito.value!.customer.afipInscription_id,
    );

    const ultimoAutorizado = await FECompUltimoAutorizado(
        invoiceType,
        invoiceForNotaCredito.value!.voucher.pto_vta,
        CompanyGetter!.value.afip_environment,
        CompanyGetter.value!.cuit,
        CompanyGetter.value!.id,
        CompanyGetter.value!.user_id,
    );

    if (ultimoAutorizado) {
        invoice.value.CbteNro = ultimoAutorizado.data.FECompUltimoAutorizadoResult.CbteNro + 1;
        invoice.value.CbteTipo = invoiceType;
        invoice.value.PtoVta = CompanyGetter.value?.pto_vta_fe;
        invoice.value.Concepto = invoiceForNotaCredito.value!.voucher.concepto.toString();
        invoice.value.customer = invoiceForNotaCredito.value!.customer;
        invoice.value.CbtesAsoc = invoiceForNotaCredito.value!.voucher.cbteAsoc;

        if (invoiceForNotaCredito.value.voucher.concepto > 1) {
            invoice.value.FchServDesde = dayjs(invoiceForNotaCredito.value!.voucher.fch_serv_desde).format('YYYYMMDD');
            invoice.value.FchServHasta = dayjs(invoiceForNotaCredito.value!.voucher.fch_serv_hasta).format('YYYYMMDD');
            invoice.value.FchVtoPago = dayjs().add(10, 'day').format('YYYYMMDD');
        }

        const FECAESolicitarObjetc = createInvoiceBuilder(builder, invoice.value, productsForNotaCredito.value);

        const params = {
            FeCabReq: FECAESolicitarObjetc.FeCabReq,
            FECAEDetRequest: FECAESolicitarObjetc.FECAEDetRequest,
            environment: CompanyGetter.value!.afip_environment,
            company_cuit: CompanyGetter.value!.cuit,
            company_id: CompanyGetter.value?.id,
            user_id: CompanyGetter.value?.user_id,
            products: productsForNotaCredito.value,
            saleCondition: 5, //{ days: 300000, id: 5 },
            paymentType: 1, //1 = Contado,
            customer: invoice.value?.customer,
            comments: invoiceForNotaCredito.value?.voucher.nota_credito_o_debito_text,
            parent: invoiceForNotaCredito.value?.id,
        };
        console.log('🚀 ~ generate ~ params:', params);

        const nota = await createInvoiceMutation.mutateAsync(params).finally(() => {
            spinner.value = false;
        });

        if (nota) {
            openDrawerNotaCredito.value = false;
        }
    }
};

onMounted(() => {
    invoice.value.CbteFch = dayjs(new Date()).format('YYYYMMDD');
});
//color F8F9FB
const bodyStyle = { 'background-color': '#cccbbb' };
const footerStyle = { height: '3rem' };
</script>
<style>
.invoice--header {
    background-color: white;
    padding: 3rem;
    border-radius: 7px;
}
.invoice--body {
    margin-top: 1rem;
    background-color: white;
    padding: 1rem;
    border-radius: 7px;
}
.invoice--body p {
    font-weight: bold;
}
</style>
