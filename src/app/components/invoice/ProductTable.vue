<template>
    <div>
        <a-typography-title :level="5" v-if="loading"
            >Generando comprobante de venta...</a-typography-title
        >
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <a-skeleton active :loading="loading" v-if="loading" />
        <Cards v-else>
            <template #title>
                <div class="ninjadash-card-title-wrap">
                    <span class="ninjadash-card-title-text"> Detalle </span>
                </div>
            </template>
            <a-row>
                <a-col :span="24" class="smaller-text">
                    <TableWrapper>
                        <ProductTable>
                            <div class="table-invoice table-responsive">
                                <a-table
                                    :dataSource="invoiceTableData"
                                    :columns="columns"
                                    :pagination="false"
                                    :scroll="{ x: '1000px' }"
                                >
                                    <template #headerCell="{ title }">
                                        <div style="text-align: left">{{ title }}</div>
                                    </template>
                                    <template #bodyCell="{ column, record, index }">
                                        <div class="scale-down">
                                            <a-row
                                                align="middle"
                                                justify="left"
                                                :gutter="31"
                                            >
                                                <a-col :span="1">{{ index + 1 }}</a-col>
                                                <a-col :span="8" class="col">
                                                    <a-typography-text type="secondary">{{
                                                        columnTitle
                                                    }}</a-typography-text>
                                                    <ProductItem
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                    />
                                                </a-col>
                                                <a-col :span="8">
                                                    <a-typography-text type="secondary"
                                                        >Precio
                                                        unitario</a-typography-text
                                                    >
                                                    <Unit
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                /></a-col>
                                            </a-row>
                                            <a-row justify="left">
                                                <a-col class="width" :span="4">
                                                    <a-typography-text type="secondary"
                                                        >Cantidad</a-typography-text
                                                    >
                                                    <Quantity
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4">
                                                    <a-typography-text type="secondary"
                                                        >Iva</a-typography-text
                                                    >
                                                    <Iva
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary"
                                                        >Descuento</a-typography-text
                                                    >
                                                    <Discount
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary"
                                                        >Subtotal</a-typography-text
                                                    >
                                                    <Subtotal
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary"
                                                        >Total</a-typography-text
                                                    >
                                                    <Total
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                /></a-col>
                                                <a-col class="width" :span="4"
                                                    ><a-typography-text type="secondary"
                                                        >Eliminar</a-typography-text
                                                    >
                                                    <Actions
                                                        :record="record"
                                                        :index="index"
                                                        class="mt5"
                                                /></a-col>
                                            </a-row>
                                        </div>
                                    </template>
                                </a-table>
                            </div>
                        </ProductTable>
                    </TableWrapper>
                    <FreeText />
                    <DrawerInvoiceComments />
                    <Totals />
                </a-col>
            </a-row>

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
                            :disabled="
                                loading ||
                                invoiceTableData.length == 0 ||
                                !invoiceConfigIsValidated
                            "
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
    </div>
</template>

<script setup lang="tsx">
import { CloudUploadOutlined } from "@ant-design/icons-vue";
import { InvoiceAction, ProductTable } from "./Style";
import { Main, TableWrapper } from "../../styled";
import { message, notification } from "ant-design-vue";
import { ref, onUnmounted, watch } from "vue";
import { SELECT_INVOICE_TYPE } from "@/app/types/Constantes";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import { useInvoiceBuilderComposable } from "@/app/composables/invoice/useInvoiceBuilderComposable";
import { useInvoiceComposable } from "@/app/composables/invoice/useInvoiceComposable";
import { usePrinterPdfComposable } from "@/app/composables/printerPdf/usePrinterPdfComposable";
import Cards from "@/components/cards/frame/CardsFrame.vue";
import Html2CanvasPdf from "@/app/pdf/Html2CanvasPdf.vue";
import Actions from "./product/Actions.vue";
import Discount from "./product/Discount.vue";
import Iva from "./product/Iva.vue";
import ProductItem from "./product/ProductItem.vue";
import Quantity from "./product/Quantity.vue";
import Subtotal from "./product/Subtotal.vue";
import Total from "./product/Total.vue";
import Totals from "./Totals.vue";
import Unit from "./product/Unit.vue";
import FreeText from "./FreeText.vue";
import ModalMiPyme from "./ModalMiPyme.vue";
import DrawerInvoiceComments from "./DrawerInvoiceComments.vue";
import { showNotification } from "@/app/helpers/notifications";
import type { Voucher } from "@/app/types/Invoice";
import type ExportEmailModal from "./ExportEmailModal.vue";

const { printPdf } = usePrinterPdfComposable();

const exportEmailModalVisible = ref<boolean>(false);

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

const {
    createConcreteInvoiceBuilder,
    createInvoiceBuilder,
    invoiceType,
} = useInvoiceBuilderComposable();

const invoiceToSend = ref<any>({});

const { CompanyGetter } = useCompanyComposable();

const loading = ref<boolean>(false);

const titulo = ref<string>("Productos a facturar www");

const columns = ref<any>([
    {
        title: "Ítems a facturar",
        dataIndex: "index",
        key: "index",
        width: "100%",
    },
]);

const generateInvoice = async () => {
    loading.value = true;

    invoice.value.PtoVta = parseInt(CompanyGetter.value!.pto_vta_fe);

    invoice.value.CbteTipo = invoice.value.voucher;

    const builder = createConcreteInvoiceBuilder(
        SELECT_INVOICE_TYPE[invoiceType.value],
        CompanyGetter.value?.inscription_id,
        invoice.value.customer.afip_inscription.id
    );

    FECAESolicitarObject.value = createInvoiceBuilder(
        builder,
        invoice.value,
        invoiceTableData.value
    );

    if (
        FECAESolicitarObject.value.FECAEDetRequest.Concepto === 2 ||
        FECAESolicitarObject.value.FECAEDetRequest.Concepto === 3
    ) {
        if (
            FECAESolicitarObject.value.FECAEDetRequest.FchServDesde === "" ||
            FECAESolicitarObject.value.FECAEDetRequest.FchServDesde === null ||
            FECAESolicitarObject.value.FECAEDetRequest.FchServHasta === "" ||
            FECAESolicitarObject.value.FECAEDetRequest.FchServHasta === null
        ) {
            message.error({
                content:
                    "Si factura servicios debe ingresar las fechas en que se desarrolló el mismo.",
            });
            loading.value = false;
            return false;
        }
    }

    if (FECAESolicitarObject.value.FECAEDetRequest.ImpTotal === 0) {
        message.error({ content: "No se permite emitir un comprobante en cero pesos." });
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
        console.log("🚀 ~ generateInvoice ~ result:", result);
        if (result.data.isMipyme) {
            openModalMiPyme.value = true;
            invoice.value.isMiPyme = true;
            FECAESolicitarObject.value.FeCabReq.CbteTipo = result.data.CbteTipo;
            FECAESolicitarObject.value.FECAEDetRequest.CbteDesde = result.data.CbteDesde;
            FECAESolicitarObject.value.FECAEDetRequest.CbteHasta = result.data.CbteHasta;

            return;
        }

        const voucher: any = result!.data!.invoice[0]!.voucher;

        showNotification(
            "success",
            "Factura generada correctamente",
            `Comprobante N° ${voucher.pto_vta}-${voucher.cbte_desde}`,
            5,
            "topLeft"
        );

        invoiceTableData.value = []; //limpia los productos de la tabla
        invoice.value.comments = ""; //limpia comentarios

        if (result.data.invoice[0]) {
            printPdf(result.data.invoice[0]);
        }
    }
};

const columnTitle = ref<string>("Producto");

watch(
    () => invoice.value.Concepto, // Observamos la propiedad "concepto"
    (newConcepto) => {
        if (newConcepto === "2" || newConcepto === "3") {
            // Si "concepto" es igual a "2" o "3", cambiamos el título
            columnTitle.value = "Servicio";
        } else {
            // Si no, restauramos el título original
            columnTitle.value = "Producto";
        }
    },
    { immediate: true } // Ejecutar el watch inmediatamente al montar el componente
);

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
.col {
    text-align: left !important;
    padding: 1rem !important;
}
.width {
    text-align: center;
}
.mt5 {
    margin-top: 5px;
}
</style>
