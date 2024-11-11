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
                <a-menu-item @click="viewPaymentHistory"> <DollarCircleOutlined /> Ver detalle de pago </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
    <ViewPreviousPaymentsModal />
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import InvoicePrinting from './InvoicePrinting.vue';
import { UpOutlined, DownOutlined, DollarCircleOutlined } from '@ant-design/icons-vue';
import { useInvoiceNotaCreditoComposable } from '@/app/composables/invoice/useInvoiceNotaCreditoComposable';
import { computed } from 'vue';
import { useVisibleComposable } from '@/app/composables/visible/useVisibleComposable';
import ViewPreviousPaymentsModal from '@/app/components/customer/receipts/ViewPreviousPaymentsModal.vue';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceListComposable } from '@/app/composables/invoice/useInvoiceListComposable';

const { CompanyGetter } = useCompanyComposable();
const { setVisible } = useVisibleComposable();
const { openDrawerNotaCredito, invoiceForNotaCredito, titleNotaCredito } = useInvoiceNotaCreditoComposable();
const { individualInvoice } = useInvoiceListComposable();

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
        return sum + invoice.items.reduce((itemSum: number, item: any) => itemSum + item.total, 0);
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
        'no',
        props.record.id, //invoice_id
    ).catch((error) => {
        console.error(error);
    });

    individualInvoice.value = invoice.data[0];
};
</script>

<style scoped>
div ul li span a {
    padding: 0px !important;
}
</style>
