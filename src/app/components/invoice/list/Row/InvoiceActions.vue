<template>
    <a-dropdown class="ant-dropdown-content">
        <a class="ant-dropdown-link" @click.prevent> más... </a>
        <template #overlay>
            <a-menu>
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
                    <DownOutlined style="color: red" /> Generar Nota de Crédito</a-menu-item
                >
                <a-menu-item
                    @click="open('NOTA DE DÉDITO')"
                    v-if="
                        (!record.voucher!.isNotaCredito && !record.voucher!.isNotaDebito) || record.voucher!.isNotaCredito
                    "
                >
                    <UpOutlined style="color: green" /> Generar Nota de Débito
                </a-menu-item>
                <a-menu-item @click="openReceiptDrawer"> <DollarCircleOutlined /> Generar recibo de pago </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <ReceiptDrawer />
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import InvoicePrinting from './InvoicePrinting.vue';
import { UpOutlined, DownOutlined, DollarCircleOutlined } from '@ant-design/icons-vue';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import { computed } from 'vue';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import ReceiptDrawer from '@/app/components/customer/receipts/ReceiptDrawer.vue';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';

const { receiptInvoices } = useReceiptComposable();

const { setVisible } = useVisibleComposable();
const { openDrawerNotaCredito, invoiceForNotaCredito, titleNotaCredito } = useInvoiceNotaCreditoComposable();

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
    console.log('🚀 ~ open ~ props.record:', props.record);
};

const CanEmitNotaCredito = computed(() => {
    return props.record.voucher.children.reduce((sum, invoice) => {
        return sum + invoice.items.reduce((itemSum: number, item) => itemSum + item.total, 0);
    }, 0);
});

const openReceiptDrawer = () => {
    setVisible(true);
    receiptInvoices.value = [props.record.voucher];
};
</script>

<style scoped>
div ul li span a {
    padding: 0px !important;
}
</style>
