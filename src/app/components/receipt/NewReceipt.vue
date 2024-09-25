<template>
    <div>
        <div id="search-customer">
            <SearchCustomer />
        </div>
        <a-transfer
            v-model:target-keys="targetKeys"
            :data-source="sourceData"
            :disabled="disabled"
            :show-search="showSearch"
            :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
            :show-select-all="false"
            @change="onChange"
            :pagination="true"
            :titles="[' Facturas a cancelar', ' Facturas seleccionadas']"
            listStyle="height: 400px"
        >
            <template
                #children="{
                    direction,
                    filteredItems,
                    selectedKeys,
                    disabled: listDisabled,
                    onItemSelectAll,
                    onItemSelect,
                }"
            >
                <a-table
                    :row-selection="
                        getRowSelection({
                            disabled: listDisabled,
                            selectedKeys,
                            onItemSelectAll,
                            onItemSelect,
                        })
                    "
                    :columns="direction === 'left' ? leftColumns : rightColumns"
                    :data-source="filteredItems"
                    size="small"
                    :style="{ pointerEvents: listDisabled ? 'none' : null }"
                    :custom-row="
                        ({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) return;
                                onItemSelect(key, !selectedKeys.includes(key));
                            },
                        })
                    "
                    :row-class-name="rowClassName"
                    class="transfer-table"
                />
            </template>
        </a-transfer>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import SearchCustomer from '@/app/components/customer/SearchCustomer.vue';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import type { InvoiceList } from '@/app/types/Invoice';
import { formatCurrency } from '@/app/helpers/formatCurrency';
import { INVOICE_TYPE } from '@/app/types/Constantes';

const { customer } = storeToRefs(useFilterSearchByCustomerStore());
const { sourceData, invoices, setinitialData, totalInvoicedAmountToCancel, enableButtonOpenDocumentCancelationDrawer } =
    useReceiptComposable();

const targetKeys = ref<string[]>([]);
const disabled = ref(false);
const showSearch = ref(true);

const NOTAS_DE_CREDITO = [
    INVOICE_TYPE.NOTA_CREDITO_A,
    INVOICE_TYPE.NOTA_CREDITO_B,
    INVOICE_TYPE.NOTA_CREDITO_C,
    INVOICE_TYPE.MIPYME_NOTA_CREDITO_A,
    INVOICE_TYPE.MIPYME_NOTA_CREDITO_B,
    INVOICE_TYPE.MIPYME_NOTA_CREDITO_C,
];

type Record = {
    //datos del tranfer que aquí los utilizo en la table
    key: string;
    title: string;
    description: string;
    disabled: boolean;
};

const leftColumns = [
    { dataIndex: 'title', title: 'Comprobante' },
    { dataIndex: 'description', title: 'Importe', align: 'right' },
];

const rightColumns = [
    { dataIndex: 'title', title: 'Comprobante' },
    { dataIndex: 'description', title: 'Importe', align: 'right' },
];

const totalInvoice = (invoice: InvoiceList) => {
    const total = invoice.items.reduce(
        (acc, item) => acc + item.neto_import + item.iva_import + item.percep_iibb_import + item.percep_iva_import,
        0,
    );

    if (NOTAS_DE_CREDITO.includes(invoice.voucher!.voucher_type)) {
        return -total;
    }

    return total;
};

const containsNotaDeCredito = (title: string) => {
    return title.includes('NOTA DE CREDITO') || title.includes('NOTAS DE CREDITO') || false;
};

const rowClassName = (record: Record) => {
    return containsNotaDeCredito(record.title) ? 'red-color' : '';
};

watch(customer, async (newVal, oldVal) => {
    setinitialData();

    const { data } = await getInvoiceList(3, 8, 1, '2024-01-01', '2024-12-31');

    invoices.value = data.data;
    console.log('🚀 ~ watch ~ invoices.value:', invoices.value);

    sourceData.value = data.data.map((invoice) => ({
        key: invoice.id.toString(),
        title: `${invoice.voucher?.name} ${invoice.voucher?.pto_vta}-${invoice.voucher?.cbte_desde}`,
        description: formatCurrency(totalInvoice(invoice)),
        disabled: false,
    }));
    // Aquí puedes agregar la lógica que necesites ejecutar cuando customer cambie
});

const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }) => ({
    onSelectAll: (selected, selectedRows) => {
        const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
        onItemSelectAll(treeSelectedKeys, selected);
    },
    onSelect: ({ key }, selected) => {
        console.log('🚀 ~ getRowSelection ~ selected:', key);
        onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
    getCheckboxProps: (item) => ({ disabled: disabled || item.disabled }),
});

const onChange = (nextTargetKeys: any) => {
    targetKeys.value = nextTargetKeys;
    enableButtonOpenDocumentCancelationDrawer.value = nextTargetKeys.length > 0;
    totalInvoicedAmountToCancel.value = invoices.value
        .filter((invoice) => nextTargetKeys.includes(invoice.id.toString()))
        .reduce((acc, item) => acc + totalInvoice(item), 0);
};
</script>

<style scoped>
#search-customer {
    margin-bottom: 2rem;
}
.red-color {
    color: red;
}
.transfer-table {
    max-height: 400px; /* Ajusta este valor según tus necesidades */
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
