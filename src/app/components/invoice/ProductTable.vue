<template>
    <Main>
        <Cards>
            <template #title>
                <div class="ninjadash-card-title-wrap">
                    <span class="ninjadash-card-title-text"> Detalle </span>
                </div>
            </template>
            <TableWrapper>
                <ProductTable>
                    <div class="table-invoice table-responsive">
                        <a-table
                            :dataSource="invoiceTableData"
                            :columns="productTableColumns"
                            :pagination="false"
                            :scroll="{ x: '1000px' }"
                        >
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'product'">
                                    <ProductItem :record="record" :index="index" />
                                </template>
                                <template v-if="column.key === 'unit'">
                                    <Unit :record="record" :index="index" />
                                </template>
                                <template v-if="column.key === 'quantity'">
                                    <Quantity :record="record" :index="index" />
                                </template>
                                <template v-if="column.key === 'iva'">
                                    <Iva :record="record" :index="index" />
                                </template>
                                <template v-if="column.key === 'discount'">
                                    <Discount :record="record" :index="index" />
                                </template>
                                <template v-if="column.key === 'subtotal'">
                                    <Subtotal :record="record" :index="index" />
                                </template>
                                <template v-if="column.key === 'total'">
                                    <Total :record="record" :index="index" />
                                </template>
                                <template v-if="column.key === 'actions'">
                                    <Actions :record="record" :index="index" />
                                </template>
                            </template>
                        </a-table>
                    </div>
                </ProductTable>
            </TableWrapper>
            <FreeText />
            <Totals />
            <a-row justify="end">
                <a-col :lg="12" :md="18" :sm="24" :offset="0">
                    <InvoiceAction>
                        <!-- <sdButton size="sm" shape="round" type="default">
						<unicon name="print" width="14"></unicon>
						<span>Print</span>
					</sdButton>
					<sdButton size="sm" shape="round" type="default">
						<unicon name="message" width="14"></unicon>
						<span>Send Invoice</span>
					</sdButton> -->
                        <a-button
                            type="primary"
                            shape="round"
                            @click="generateInvoice"
                            :loading="loading"
                            :disabled="loading || invoiceTableData.length == 0 || !invoiceConfigIsValidated"
                        >
                            <template #icon v-if="invoiceTableData.length">
                                <CloudUploadOutlined />
                            </template>
                            Facturar
                        </a-button>
                    </InvoiceAction>
                </a-col>
            </a-row>
        </Cards>
        <Html2CanvasPdf />
        <ModalMiPyme />
    </Main>
</template>

<script setup lang="tsx">
import { CloudUploadOutlined } from '@ant-design/icons-vue';
import { InvoiceAction, ProductTable } from './Style';
import { Main, TableWrapper } from '../../styled';
import { message } from 'ant-design-vue';
import { ref, onUnmounted } from 'vue';
import { SELECT_INVOICE_TYPE } from '@/app/types/Constantes';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import Cards from '@/components/cards/frame/CardsFrame.vue';
import Html2CanvasPdf from '@/app/pdf/Html2CanvasPdf.vue';
import Actions from './product/Actions.vue';
import Discount from './product/Discount.vue';
import Iva from './product/Iva.vue';
import ProductItem from './product/ProductItem.vue';
import Quantity from './product/Quantity.vue';
import Subtotal from './product/Subtotal.vue';
import Total from './product/Total.vue';
import Totals from './Totals.vue';
import Unit from './product/Unit.vue';
import FreeText from './FreeText.vue';
import ModalMiPyme from './ModalMiPyme.vue';

const { printPdf } = usePrinterPdfComposable();

const {
    invoiceTableData,
    createInvoiceMutation,
    invoiceInitialStatus,
    InvoiceGetter,
    invoice,
    invoiceConfigIsValidated,
    openModalMiPyme,
    FECAESolicitarObject,
} = useInvoiceComposable();

const { createConcreteInvoiceBuilder, createInvoiceBuilder, invoiceType } = useInvoiceBuilderComposable();

const { CompanyGetter } = useCompanyComposable();

const loading = ref<boolean>(false);

const productTableColumns = [
    {
        title: '#',
        dataIndex: 'row',
        key: 'row',
    },
    {
        title: 'Producto',
        dataIndex: 'product',
        key: 'product',
    },
    {
        title: 'Precio/U',
        dataIndex: 'unit',
        key: 'unit',
    },
    {
        title: 'Cantidad',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Iva',
        dataIndex: 'iva',
        key: 'iva',
    },
    {
        title: 'Desc.',
        dataIndex: 'discount',
        key: 'discount',
    },
    {
        title: 'Subtotal',
        dataIndex: 'subtotal',
        key: 'subtotal',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Acciones',
        dataIndex: 'actions',
        key: 'actions',
    },
];

const generateInvoice = async () => {
    loading.value = true;

    invoice.value.PtoVta = parseInt(CompanyGetter.value!.pto_vta_fe);

    invoice.value.CbteTipo = invoice.value.voucher;

    const builder = createConcreteInvoiceBuilder(
        SELECT_INVOICE_TYPE[invoiceType.value],
        CompanyGetter.value?.inscription_id,
        invoice.value.customer.afip_inscription.id,
    );

    FECAESolicitarObject.value = createInvoiceBuilder(builder, invoice.value, invoiceTableData.value);

    if (
        FECAESolicitarObject.value.FECAEDetRequest.Concepto === 2 ||
        FECAESolicitarObject.value.FECAEDetRequest.Concepto === 3
    ) {
        if (
            FECAESolicitarObject.value.FECAEDetRequest.FchServDesde === '' ||
            FECAESolicitarObject.value.FECAEDetRequest.FchServDesde === null ||
            FECAESolicitarObject.value.FECAEDetRequest.FchServHasta === '' ||
            FECAESolicitarObject.value.FECAEDetRequest.FchServHasta === null
        ) {
            message.error({
                content: 'Si factura servicios debe ingresar las fechas en que se desarrolló el mismo.',
            });
            loading.value = false;
            return false;
        }
    }

    if (FECAESolicitarObject.value.FECAEDetRequest.ImpTotal === 0) {
        message.error({ content: 'No se permite emitir un comprobante en cero.' });
        loading.value = false;
        return false;
    }

    const params = {
        FeCabReq: FECAESolicitarObject.value.FeCabReq,
        FECAEDetRequest: FECAESolicitarObject.value.FECAEDetRequest,
        environment: CompanyGetter.value?.afip_environment,
        company_cuit: CompanyGetter.value?.cuit,
        company_id: CompanyGetter.value?.id,
        user_id: CompanyGetter.value?.user_id,
        products: invoiceTableData.value,
        saleCondition: InvoiceGetter.value.SaleCondition,
        customer: InvoiceGetter.value?.customer,
        comments: InvoiceGetter.value?.comments,
        paymentType: InvoiceGetter.value?.paymentType,
        isMiPyme: InvoiceGetter.value?.isMiPyme,
    };

    const result = await createInvoiceMutation
        .mutateAsync(params)
        .catch((err) => {
            console.log(`🚀 ~ file: ProductTable.vue:160 ~ generateInvoice ~ err:`, err);
        })
        .finally(() => (loading.value = false));

    if (result) {
        console.log('🚀 ~ generateInvoice ~ result:', result);
        if (result.data.isMipyme) {
            openModalMiPyme.value = true;
            invoice.value.isMiPyme = true;
            FECAESolicitarObject.value.FeCabReq.CbteTipo = result.data.CbteTipo;
            FECAESolicitarObject.value.FECAEDetRequest.CbteDesde = result.data.CbteDesde;
            FECAESolicitarObject.value.FECAEDetRequest.CbteHasta = result.data.CbteHasta;

            return;
        }

        message.success({
            content: `Factura generada correctamente`,
            duration: 3,
        });

        invoiceTableData.value = []; //limpia los productos de la tabla
        invoice.value.comments = ''; //limpia comentarios

        if (result.data.invoice[0]) {
            printPdf(result.data.invoice[0]);
        }
    }
};

onUnmounted(() => {
    invoiceInitialStatus();
    invoiceTableData.value = [];
});
</script>

<style scoped>
@media (max-width: 600px) {
    .ant-table-cell {
        font-size: 12px;
        padding: 8px;
    }
}
</style>
