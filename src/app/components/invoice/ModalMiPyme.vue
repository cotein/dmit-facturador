<template>
    <div>
        <a-modal
            v-model:visible="openModalMiPyme"
            width="1000px"
            title="Factura MiPyme"
            :destroyOnClose="true"
            :closable="false"
            :maskClosable="false"
            :disabled="loading || !CompanyGetter?.cbus || CompanyGetter.cbus[0].cbu == ''"
            @ok="generateMiPymeInvoice"
            :confirmLoading="loading"
            :bodyStyle="{
                height: '8rem',
            }"
        >
            <a-row :gutter="16" v-if="CompanyGetter?.cbus && CompanyGetter.cbus[0].cbu != ''">
                <a-col :span="12">
                    <a-radio-group v-model:value="transferType" @change="setOptional">
                        <a-radio :value="'SCA'">TRANSFERENCIA AL SISTEMA DE CIRCULACION ABIERTA</a-radio>
                        <a-radio :value="'ADC'">AGENTE DE DEPOSITO COLECTIVO</a-radio>
                    </a-radio-group>
                </a-col>
                <a-col :span="12">
                    <a-date-picker
                        v-model:value="invoice.dateVtoPago"
                        style="width: 100%"
                        showToday
                        :format="dateFormat"
                        placeholder="Vencimiento de pago"
                        @change="servicesDateFchVtoPago"
                    />
                </a-col>
            </a-row>
            <a-row :gutter="16" v-else>
                <a-col :span="12"> No se encuentra configurado el CBU de la empresa </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { showMessage } from '@/app/helpers/mesaages';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
const { openModalMiPyme, FECAESolicitarObject, invoiceTableData, InvoiceGetter, createInvoiceMutation, invoice } =
    useInvoiceComposable();

const { CompanyGetter } = useCompanyComposable();

const { printPdf } = usePrinterPdfComposable();

const loading = ref(false);

const dateFormat = 'DD-MM-YYYY';

const transferType = ref();

const setOptional = (e: Event) => {
    const target = e.target as HTMLInputElement;

    const optional = [
        {
            Id: '27',
            Valor: transferType.value.toString(),
        },
    ];

    /**
     * Si el tipo de comprobante que está autorizando es MiPyMEs
    (FCE), informa opcionales, el valor correcto para el código 2101
    es un CBU nu
     */
    const optional1 = [
        {
            Id: '2101',
            Valor: CompanyGetter.value?.cbus[0].cbu,
        },
    ];

    FECAESolicitarObject.value!.FECAEDetRequest.Opcionales = [...optional, ...optional1];
};
const servicesDateFchVtoPago = (date: any) => {
    let day = null;

    if (date.$D < 10) {
        day = '0' + date.$D;
    } else {
        day = date.$D;
    }

    if (date.$M + 1 < 10) {
        FECAESolicitarObject.value!.FECAEDetRequest.FchVtoPago = `${date.$y}0${date.$M + 1}${day}`;
    } else {
        FECAESolicitarObject.value!.FECAEDetRequest.FchVtoPago = `${date.$y}${date.$M + 1}${day}`;
    }
};

const generateMiPymeInvoice = async () => {
    loading.value = true;

    const params = {
        FeCabReq: FECAESolicitarObject.value!.FeCabReq,
        FECAEDetRequest: FECAESolicitarObject.value!.FECAEDetRequest,
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
    console.log('🚀 ~ generateMiPymeInvoice ~ params:', params);

    const result = await createInvoiceMutation
        .mutateAsync(params)
        .catch((err) => {
            console.log(`🚀 ~ file: ProductTable.vue:160 ~ generateInvoice ~ err:`, err);
            showMessage('error', err.response.data.message, 6);
        })
        .finally(() => (loading.value = false));

    if (result) {
        openModalMiPyme.value = false;

        invoice.value.isMiPyme = false;

        showMessage('success', 'Factura generada correctamente', 3);

        invoiceTableData.value = []; //limpia los productos de la tabla

        invoice.value.comments = ''; //limpia comentarios

        if (result.data.invoice[0]) {
            printPdf(result.data.invoice[0]);
        }
    }
};
</script>
