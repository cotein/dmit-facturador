<template>
    <a-select
        show-search
        placeholder="Comprobante"
        style="width: 100%"
        :default-active-first-option="false"
        :show-arrow="false"
        :filter-option="false"
        :allowClear="true"
        :not-found-content="null"
        :field-names="{ label: 'name', value: 'id' }"
        :options="Vouchers"
        v-model:value="defaultVoucher"
        @select="select"
    ></a-select>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useInvoiceComposable } from '@/app/composables/invoice/useInvoiceComposable';
import { useInvoiceBuilderComposable } from '@/app/composables/invoice/useInvoiceBuilderComposable';
import { useVoucherComposable } from '@/app/composables/voucher/useVoucherComposable';

const { invoice } = useInvoiceComposable();
const { CompanyGetter } = useCompanyComposable();
const { invoiceType } = useInvoiceBuilderComposable();
const { Vouchers } = useVoucherComposable();

const value = ref(null);

const defaultVoucher = computed({
    get() {
        return invoice.value.voucher;
    },
    set(val) {
        invoice.value.voucher = val;
    },
});

const voucherSelectorComponentSetValue = () => {
    value.value = null;
};

const select = async (_: any, option: any) => {
    invoice.value.voucher = option.id;
    invoiceType.value = option.id;
};

defineExpose({ voucherSelectorComponentSetValue });
</script>
