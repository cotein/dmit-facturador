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
import type { EmailAttachment } from "@/app/types/Email";

const {
    toggleDrawerEmail,
    formSenderEmailData,
    invoiceToBeConvertedToPdf,
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

    console.log(" invoice Actions ", props.record);

    const company_name = `${CompanyGetter.value?.name} ${
        CompanyGetter.value?.lastName ? CompanyGetter.value?.lastName : ""
    }`;

    const fileBase64 = await getPdfFile(invoiceToBeConvertedToPdf.value as InvoiceList);
    //console.log("🚀 ~ emailSettings ~ fileBase64:", fileBase64);
    // Extraer el nombre del archivo y el contenido en base64
    const [metadata, base64Content] = fileBase64.split(",");
    const filenameMatch = metadata.match(/filename=([^;]+)/);
    const filename = filenameMatch ? filenameMatch[1] : "default.pdf";
    console.log("🚀 ~ emailSettings ~ filename:", filename);

    console.log("🚀 ~ emailSettings ~ base64Content:", base64Content);

    formSenderEmailData.value = {
        from: "info@dmit.ar",
        to: "diego.barrueta@gmail.com",
        subject: `${company_name} le ha enviado una factura`,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">
            <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto;">
            <h2 style="color: #4CAF50;">Estimado cliente,</h2>
            <p style="font-size: 16px;">Le informamos que ha recibido una factura por la compra realizada.</p>
            <p style="font-size: 16px;">Mediante el presente e-mail se adjunta factura N° ${
                (invoiceToBeConvertedToPdf.value as InvoiceList).voucher?.name
            } ${(invoiceToBeConvertedToPdf.value as InvoiceList).voucher!.pto_vta} - ${
            (invoiceToBeConvertedToPdf.value as InvoiceList).voucher!.cbte_desde
        } con fecha ${
            (invoiceToBeConvertedToPdf.value as InvoiceList).voucher!.cbte_fch
        }</p>
            <p style="font-size: 16px;">Gracias por su compra.</p>
            <p style="font-size: 16px;">Atentamente,</p>
            <p style="font-size: 16px; font-weight: bold;">El equipo de ventas de ${company_name}</p>
            </div>
        </div>`,
        text: "",
    };

    if (!formSenderEmailData.value.attachments) {
        formSenderEmailData.value.attachments = [] as EmailAttachment[];
    }

    if (!formSenderEmailData.value.attachments.length) {
        formSenderEmailData.value.attachments.push({ content: "", filename: "" });
    } else {
        formSenderEmailData.value.attachments[0].content = "";
        formSenderEmailData.value.attachments[0].filename = "";
    }
    console.log(
        "🚀 ~ aaaaaaaaaaaaaaaaaaaaa.value:",
        formSenderEmailData.value.attachments
    );
    formSenderEmailData.value.attachments[0].content = base64Content;
    formSenderEmailData.value.attachments[0].filename = filename;

    toggleDrawerEmail();
};
</script>

<style scoped>
div ul li span a {
    padding: 0px !important;
}
</style>
