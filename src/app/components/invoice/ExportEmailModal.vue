<template>
    <a-modal
        :visible="visible"
        title="Imprimir o enviar el comprobante"
        :ok-text="selectedOption === 'pdf' ? 'Imprimir' : 'Preparar el email'"
        cancel-text="Cancelar"
        :ok-button-props="{ disabled: !canExport }"
        @ok="handleOk"
        @cancel="close"
    >
        <a-radio-group v-model:value="selectedOption">
            <a-radio value="pdf">Exportar a PDF</a-radio>
            <a-radio value="email">Enviar por e-mail</a-radio>
        </a-radio-group>

        <!-- Sin comprobante emitido no hay nada que imprimir: se dice acá y se
             deshabilita el aceptar, en vez de romper al confirmar. -->
        <p v-if="!canExport" class="export-note" data-testid="export-empty">
            Todavía no hay un comprobante emitido en esta sesión. Facturá y volvé a intentar.
        </p>
    </a-modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useEmailComposable } from '@/app/composables/email/useEmailComposable';
import { generateInvoiceEmailHtml } from '@/app/helpers/email/invoicetemplateHtml';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useSleepComposable } from '@/app/composables/sleep/useSleepComposable';
import { usePrinterPdfComposable } from '@/app/composables/printerPdf/usePrinterPdfComposable';
import type { InvoiceList } from '@/app/types/Invoice';

/**
 * Imprimir, exportar a PDF o mandar el comprobante por email.
 *
 * Este es el modal que el modo normal usa para las acciones sobre el papel. Recibe
 * el comprobante y la empresa de los composables —no por props sueltas— para que la
 * pantalla que lo abre no tenga que armar objetos raros, y avisa por
 * `update:visible` en vez de escribir sobre su propia prop: Vue rechaza esa
 * escritura y dejaba un warning en consola cada vez que se cerraba.
 */
type Props = {
    visible?: boolean;
    /** El comprobante emitido, tal como lo devolvió ARCA. Sin él no hay nada que imprimir. */
    invoice?: InvoiceList | null;
    /** Qué opción viene elegida desde el botón que lo abrió. */
    option?: 'pdf' | 'email';
};

const props = withDefaults(defineProps<Props>(), {
    visible: false,
    invoice: null,
    option: 'pdf',
});

const emit = defineEmits<{ (event: 'update:visible', value: boolean): void }>();

const { getPdfFile, printPdf } = usePrinterPdfComposable();

const { sleep } = useSleepComposable();

const { CompanyGetter } = useCompanyComposable();

const { toggleDrawerEmail, formSenderEmailData, invoiceToBeConvertedToPdf } = useEmailComposable();

const selectedOption = ref<'pdf' | 'email'>(props.option);

const canExport = computed(() => props.invoice !== null && props.invoice !== undefined);

// Cada apertura vuelve a la opción del botón que la disparó.
watch(
    () => props.visible,
    (open) => {
        if (open) {
            selectedOption.value = props.option ?? 'pdf';
        }
    },
);

const close = () => {
    emit('update:visible', false);
};

const sendEmail = async () => {
    const company = CompanyGetter.value;

    if (!company) {
        message.error({ content: 'Falta cargar los datos de la empresa para poder enviar el comprobante.' });

        return;
    }

    invoiceToBeConvertedToPdf.value = props.invoice as InvoiceList;

    const company_name = `${company.name} ${company.lastName ? company.lastName : ''}`;

    await sleep(500);

    const fileBase64 = await getPdfFile(invoiceToBeConvertedToPdf.value as InvoiceList);

    // Extraer el nombre del archivo y el contenido en base64
    const [metadata, base64Content] = fileBase64.split(',');

    const filenameMatch = metadata.match(/filename=([^;]+)/);

    const filename = filenameMatch ? filenameMatch[1] : 'default.pdf';

    const html = generateInvoiceEmailHtml(invoiceToBeConvertedToPdf.value, company_name);

    formSenderEmailData.value.from = `${company_name} <info@dmit.ar>`;
    formSenderEmailData.value.to = company.email;
    formSenderEmailData.value.subject = `${company_name} le ha enviado una factura`;
    formSenderEmailData.value.html = html;
    formSenderEmailData.value.text = '';
    formSenderEmailData.value.attachments![0].content = base64Content;
    formSenderEmailData.value.attachments![0].filename = filename;

    toggleDrawerEmail();
};

const handleOk = async () => {
    if (!canExport.value) {
        return;
    }

    close();

    try {
        if (selectedOption.value === 'pdf') {
            printPdf(props.invoice as InvoiceList);

            return;
        }

        await sendEmail();
    } catch (e) {
        console.log('🚀 ~ ExportEmailModal ~ handleOk:', e);

        message.error({ content: 'No pudimos preparar el comprobante para imprimir o enviar.' });
    }
};
</script>

<style scoped>
.export-note {
    margin: 12px 0 0;
    font-size: 13px;
    color: #585858;
}
</style>
