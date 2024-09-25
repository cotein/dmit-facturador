<template>
    <div>
        <span v-if="props.record?.voucher.children.length">
            <a-popover title="Comprobante asociado" trigger="hover">
                <template #content>
                    <p
                        v-for="(children, index) in props.record?.voucher.children"
                        :key="index"
                        style="margin: 5px 10px"
                    >
                        {{ children.invoice }}
                        <InvoicePrintingById :invoice_id="children.invoice_id" :company_id="children.company_id" />
                    </p>
                </template>
                <span class="invoice">
                    <a-typography-text
                        >{{ props.record?.voucher.name }} {{ props.record.voucher.pto_vta }} -
                        {{ props.record.voucher.cbte_desde }}</a-typography-text
                    >
                </span>
            </a-popover>
        </span>

        <span v-else-if="props.record?.voucher.parents.length">
            <a-popover title="Comprobante asociado" trigger="hover">
                <template #content>
                    <p v-for="(parent, index) in props.record?.voucher.parents" :key="index" style="margin: 5px 10px">
                        {{ parent.invoice }}
                        <!-- <a-button type="primary" style="margin-left: 5px" @click="printInvoice"> Ver </a-button> -->
                        <InvoicePrintingById :invoice_id="parent.invoice_id" :company_id="parent.company_id" />
                    </p>
                </template>
                <span class="invoice">
                    <a-typography-text
                        >{{ props.record?.voucher.name }} {{ props.record.voucher.pto_vta }} -
                        {{ props.record.voucher.cbte_desde }}</a-typography-text
                    >
                </span>
            </a-popover>
        </span>
        <span class="left" v-else>
            {{ props.record?.voucher.name }} {{ props.record.voucher.pto_vta }} -
            {{ props.record.voucher.cbte_desde }}
        </span>
    </div>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import InvoicePrintingById from './InvoicePrintingById.vue';
type Props = {
    record: InvoiceList;
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});
</script>

<style scoped>
div {
    text-align: left;
    width: 100%;
}
.left {
    text-align: left;
}
</style>
