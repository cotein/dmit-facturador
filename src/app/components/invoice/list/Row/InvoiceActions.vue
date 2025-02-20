<template>
    <a-dropdown class="ant-dropdown-content">
        <a class="ant-dropdown-link" @click.prevent> más... </a>
        <template #overlay>
            <a-menu>
                <a-menu-item @click="emailSettings">
                    <SendOutlined /> Envíar por correo
                </a-menu-item>
                <a-menu-item>
                    <InvoicePrinting :data="record" />
                </a-menu-item>
                <a-menu-item
                    :disabled="CanEmitNotaCredito === record.voucher!.total"
                    @click="open('NOTA DE CRÉDITO')"
                    v-if="
                        (!record.voucher!.isNotaCredito && !record.voucher!.isNotaDebito) || record.voucher!.isNotaDebito
                    "
                >
                    <DownOutlined style="color: red" /> Generar Nota de Crédito
                </a-menu-item>
                <a-menu-item
                    @click="open('NOTA DE DÉDITO')"
                    v-if="
                        (!record.voucher!.isNotaCredito && !record.voucher!.isNotaDebito) || record.voucher!.isNotaCredito
                    "
                >
                    <UpOutlined style="color: green" /> Generar Nota de Débito
                </a-menu-item>
                <a-menu-item @click="viewPaymentHistory">
                    <DollarCircleOutlined /> Ver detalle de pago
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <ViewPreviousPaymentsModal />
</template>

<script setup lang="ts">
import type { InvoiceList } from "@/app/types/Invoice";
import InvoicePrinting from "./InvoicePrinting.vue";
import {
    UpOutlined,
    DownOutlined,
    DollarCircleOutlined,
    SendOutlined,
} from "@ant-design/icons-vue";
import { useInvoiceNotaCreditoComposable } from "@/app/composables/invoice/useInvoiceNotaCreditoComposable";
import { computed } from "vue";
import { useVisibleComposable } from "@/app/composables/visible/useVisibleComposable";
import ViewPreviousPaymentsModal from "@/app/components/customer/receipts/ViewPreviousPaymentsModal.vue";
import { getInvoiceList } from "@/api/invoice/invoice-api";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import { useInvoiceListComposable } from "@/app/composables/invoice/useInvoiceListComposable";
import { useEmailComposable } from "@/app/composables/email/useEmailComposable";
import { usePrinterPdfComposable } from "@/app/composables/printerPdf/usePrinterPdfComposable";
import { useSleepComposable } from "@/app/composables/sleep/useSleepComposable";
import { generateInvoiceEmailHtml } from "@/app/helpers/email/invoicetemplateHtml";

const { sleep } = useSleepComposable();
const {
    toggleDrawerEmail,
    formSenderEmailData,
    invoiceToBeConvertedToPdf,
    updateFormSenderEmailData,
} = useEmailComposable();

const { CompanyGetter } = useCompanyComposable();
const { setVisible } = useVisibleComposable();
const {
    openDrawerNotaCredito,
    invoiceForNotaCredito,
    titleNotaCredito,
} = useInvoiceNotaCreditoComposable();
const { individualInvoice } = useInvoiceListComposable();
const { getPdfFile } = usePrinterPdfComposable();

type Props = {
    index: number;
    record: InvoiceList;
};
const props = withDefaults(defineProps<Props>(), {
    index: undefined,
});

const open = (name: string) => {
    titleNotaCredito.value = name;
    openDrawerNotaCredito.value = true;
    invoiceForNotaCredito.value = props.record;
};

const CanEmitNotaCredito = computed(() => {
    return props.record.voucher?.children.reduce((sum, invoice) => {
        return (
            sum +
            invoice.items.reduce((itemSum: number, item: any) => itemSum + item.total, 0)
        );
    }, 0);
});

const viewPaymentHistory = async () => {
    setVisible(true);
    const invoice = await getInvoiceList(
        CompanyGetter!.value!.id ?? 0,
        null,
        null,
        null,
        null,
        null,
        null,
        "no",
        props.record.id //invoice_id
    ).catch((error) => {
        console.error(error);
    });

    individualInvoice.value = invoice.data[0];
};

const emailSettings = async () => {
    invoiceToBeConvertedToPdf.value = props.record;

    console.log("invoice Actions", invoiceToBeConvertedToPdf.value);

    const company_name = `${CompanyGetter.value?.name} ${
        CompanyGetter.value?.lastName ? CompanyGetter.value?.lastName : ""
    }`;
    await sleep(1000);

    const fileBase64 = await getPdfFile(invoiceToBeConvertedToPdf.value as InvoiceList);
    //console.log("🚀 ~ emailSettings ~ fileBase64:", fileBase64);
    // Extraer el nombre del archivo y el contenido en base64
    const [metadata, base64Content] = fileBase64.split(",");

    const filenameMatch = metadata.match(/filename=([^;]+)/);

    const filename = filenameMatch ? filenameMatch[1] : "default.pdf";

    const html = generateInvoiceEmailHtml(invoiceToBeConvertedToPdf.value, company_name);

    formSenderEmailData.value.from = `${company_name} <info@dmit.ar>`;
    formSenderEmailData.value.to = CompanyGetter.value!.email;
    formSenderEmailData.value.subject = `${company_name} le ha enviado una factura`;
    formSenderEmailData.value.html = html;
    formSenderEmailData.value.text = "";
    formSenderEmailData.value.attachments![0].content = base64Content;
    formSenderEmailData.value.attachments![0].filename = filename;

    toggleDrawerEmail();
};
</script>

<style scoped>
div ul li span a {
    padding: 0px !important;
}
</style>
