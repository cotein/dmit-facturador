<template>
    <a-modal
        v-model:visible="visible"
        title="Seleccione una opción"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <a-radio-group v-model="selectedOption">
            <a-radio value="pdf">Exportar a PDF</a-radio>
            <a-radio value="email">Enviar por e-mail</a-radio>
        </a-radio-group>
    </a-modal>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { useEmailComposable } from "@/app/composables/email/useEmailComposable";
import { generateInvoiceEmailHtml } from "@/app/helpers/email/invoicetemplateHtml";
import { useCompanyComposable } from "@/app/composables/company/useCompanyComposable";
import { useSleepComposable } from "@/app/composables/sleep/useSleepComposable";
import { usePrinterPdfComposable } from "@/app/composables/printerPdf/usePrinterPdfComposable";
import type { InvoiceList } from "@/app/types/Invoice";

const { getPdfFile, printPdf } = usePrinterPdfComposable();

const { sleep } = useSleepComposable();

const { CompanyGetter } = useCompanyComposable();

const {
    toggleDrawerEmail,
    formSenderEmailData,
    invoiceToBeConvertedToPdf,
} = useEmailComposable();

interface Props {
    visible: boolean;
    company: any;
    invoice: any;
}

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    company: {},
    invoice: {},
});

const sendEmail = async () => {
    invoiceToBeConvertedToPdf.value = props.invoice;

    const company_name = `${props.company.value.name} ${
        props.company.value.lastName ? props.company.value.lastName : ""
    }`;

    await sleep(500);

    const fileBase64 = await getPdfFile(invoiceToBeConvertedToPdf.value as InvoiceList);
    //console.log("🚀 ~ sendEmail ~ fileBase64:", fileBase64);
    // Extraer el nombre del archivo y el contenido en base64
    const [metadata, base64Content] = fileBase64.split(",");

    const filenameMatch = metadata.match(/filename=([^;]+)/);

    const filename = filenameMatch ? filenameMatch[1] : "default.pdf";

    const html = generateInvoiceEmailHtml(invoiceToBeConvertedToPdf.value, company_name);

    formSenderEmailData.value.from = `${company_name} <info@dmit.ar>`;
    formSenderEmailData.value.to = props.company.value.email;
    formSenderEmailData.value.subject = `${company_name} le ha enviado una factura`;
    formSenderEmailData.value.html = html;
    formSenderEmailData.value.text = "";
    formSenderEmailData.value.attachments![0].content = base64Content;
    formSenderEmailData.value.attachments![0].filename = filename;

    toggleDrawerEmail();
};

const emit = defineEmits(["update:visible"]);

const selectedOption = ref("pdf");

const handleOk = () => {
    if (selectedOption.value === "pdf") {
        printPdf(props.invoice);
    } else if (selectedOption.value === "email") {
        sendEmail();
    }
};

const handleCancel = () => {};
</script>
