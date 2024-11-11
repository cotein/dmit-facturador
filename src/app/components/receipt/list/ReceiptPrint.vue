<template>
    <div>
        <a-tooltip placement="topLeft" title="Imprimir recibo">
            <a-button :loading="loadingPrintReceipt" type="primary" @click="printReceipt">
                <template #icon><PrinterFilled /></template>
            </a-button>
        </a-tooltip>
    </div>
</template>

<script setup lang="ts">
import { fetchReport } from '@/api-reports/api-reports-base';
import { getReceiptById } from '@/api/receipt/receipt-api';
import { showMessage } from '@/app/helpers/mesaages';
import { zeroLeft } from '@/app/helpers/zero-left';
import type { PrinteableReceiptData } from '@/app/types/Receipt';
import { PrinterFilled } from '@ant-design/icons-vue';
import { ref } from 'vue';

type Props = {
    printeableData?: PrinteableReceiptData | null;
    receipt_id?: number | null;
};

const props = withDefaults(defineProps<Props>(), {
    printeableData: null,
    receipt_id: null,
});

const loadingPrintReceipt = ref<boolean>(false);

// Función para generar el nombre del archivo
const generateFileName = (data: PrinteableReceiptData): string => {
    const receiptNumber = `${zeroLeft(data.receipt.pto_vta_receipt, 4)}-${zeroLeft(data.receipt.number, 8)}`;
    return `${data.company.name}-RECIBO DE PAGO ${receiptNumber}.pdf`;
};

// Función para manejar la impresión del recibo
const handlePrintReceipt = async (data: PrinteableReceiptData) => {
    const fileName = generateFileName(data);
    try {
        await fetchReport('receipt-report', fileName, data);
    } catch (error) {
        showMessage('error', 'Error al generar el recibo de pago', 2);
        console.error('Error al generar el recibo de pago:', error);
    } finally {
        loadingPrintReceipt.value = false;
    }
};

// Función principal para imprimir el recibo
const printReceipt = async () => {
    loadingPrintReceipt.value = true;

    try {
        if (props.receipt_id && !props.printeableData) {
            const response = await getReceiptById(props.receipt_id);
            if (response && response.data) {
                await handlePrintReceipt(response.data);
            } else {
                showMessage('error', 'Error al obtener los datos del recibo', 2);
            }
        } else if (props.printeableData) {
            await handlePrintReceipt(props.printeableData);
        } else {
            showMessage('error', 'Error al generar el recibo de pago', 2);
        }
    } catch (error) {
        showMessage('error', 'Error al generar el recibo de pago', 2);
    } finally {
        loadingPrintReceipt.value = false;
    }
};
</script>

<style scoped></style>
