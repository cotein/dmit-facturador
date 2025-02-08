<template>
    <div class="new-receipt">
        <a-row :gutter="[15, 15]" style="margin-bottom: 2rem">
            <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                <span>Buscar cliente</span>
                <SearchCustomer :context="'receipt'" />
            </a-col>
            <a-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11" style="padding-top: 1rem">
                <DatePickerRangeBase v-model="selectedDates" @change="onDateChange" />
            </a-col>
            <a-col
                :xs="24"
                :sm="24"
                :md="2"
                :lg="2"
                :xl="2"
                style="display: flex; justify-content: center; padding-top: 1rem"
            >
                <div id="button-filter-data">
                    <a-button @click="getInvoicesToPay" :loading="loading" type="primary" style="margin-bottom: 1rem"
                        >Buscar</a-button
                    >
                </div>
            </a-col>
        </a-row>
        <a-row :gutter="[15, 15]" style="margin-bottom: 2rem">
            <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <a-transfer
                    v-model:target-keys="targetKeys"
                    :data-source="sourceData"
                    :disabled="disabled"
                    :show-search="showSearch"
                    :filter-option="(inputValue, item) => item.title.indexOf(inputValue) !== -1"
                    :show-select-all="false"
                    @change="onChange"
                    :pagination="true"
                    :titles="[' Comprobantes adeudados', ' Comprobantes a cancelar']"
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
                            :pagination="false"
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
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import SearchCustomer from '@/app/components/customer/SearchCustomer.vue';
import { useFilterSearchByCustomerStore } from '@/app/store/filter-search/useFilterSearchByCustomerStore';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import DatePickerRangeBase from '@/app/componentsBase/DatePickerRangeBase.vue';
import { useFilterSearchByBetweenDaysStore } from '@/app/store/filter-search/useFilterSearchByBetweenDaysStore';
import type { Dayjs } from 'dayjs';
import { getInvoiceList } from '@/api/invoice/invoice-api';
import { useCompanyComposable } from './../../composables/company/useCompanyComposable';
import { formatCurrency } from '@/app/helpers/formatCurrency';
const { CompanyGetter } = useCompanyComposable();

const { from, to } = storeToRefs(useFilterSearchByBetweenDaysStore());

const selectedDates = ref<[Dayjs, Dayjs] | null>(null);

const onDateChange = (dates: [Dayjs, Dayjs] | null): [string, string] | null => {
    if (dates && dates.length === 2) {
        const formattedDates: [string, string] = [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')];
        from.value = formattedDates[0];
        to.value = formattedDates[1];
        return formattedDates;
    }
    return null;
};

const { customer } = storeToRefs(useFilterSearchByCustomerStore());

const {
    sourceData,
    invoices,
    totalInvoicedAmountToCancel,
    enableButtonOpenDocumentCancelationDrawer,
    selectedInvoiceIds,
    setinitialDataAtReceipt,
    isCreatedReceipt,
} = useReceiptComposable();

const targetKeys = ref<string[]>([]);
const disabled = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const loading = ref<boolean>(false);
const selectedKeys = ref<string[]>([]);

type Record = {
    //datos del tranfer que aquí los utilizo en la table
    key: string;
    title: string;
    description: string;
    saldo: string;
    disabled: boolean;
};

const sumPreviousPayment = (invoice: any) => {
    return invoice.previousPayment.reduce((acc: number, item: any) => {
        return acc + parseFloat(item.importPayment);
    }, 0);
};

const getInvoicesToPay = async () => {
    setinitialDataAtReceipt();

    loading.value = true;

    const res = await getInvoiceList(
        CompanyGetter.value!.id!,
        customer.value?.value!,
        null,
        from.value,
        to.value,
        null,
        null,
        'no',
        null,
        true,
    )
        .catch((error) => {
            console.log('🚀 ~ getInvoicesToPay ~ error:', error);
        })
        .finally(() => {
            loading.value = false;
        });

    if (res) {
        invoices.value = res.data;
        sourceData.value = res.data.map((item: any) => {
            const saldo =
                Array.isArray(item.previousPayment) && item.previousPayment.length > 0
                    ? item.import - sumPreviousPayment(item)
                    : item.import;

            return {
                key: item.id.toString(),
                title: item.number,
                description: formatCurrency(item.import),
                saldo: formatCurrency(saldo),
                disabled: false,
            };
        });
    }
};

const leftColumns = [
    { dataIndex: 'title', title: 'Comprobante' },
    { dataIndex: 'description', title: 'Importe', align: 'right' },
    { dataIndex: 'saldo', title: 'Saldo', align: 'right' },
];

const rightColumns = [
    { dataIndex: 'title', title: 'Comprobante' },
    { dataIndex: 'description', title: 'Importe', align: 'right' },
    { dataIndex: 'saldo', title: 'Saldo', align: 'right' },
];

const rowClassName = (record: Record) => {
    return 'red-color';
};

const getRowSelection = ({ disabled, selectedKeys, onItemSelectAll, onItemSelect }) => ({
    onSelectAll: (selected, selectedRows) => {
        const treeSelectedKeys = selectedRows.filter((item) => !item.disabled).map(({ key }) => key);
        onItemSelectAll(treeSelectedKeys, selected);
    },
    onSelect: ({ key }, selected) => {
        onItemSelect(key, selected);
    },
    selectedRowKeys: selectedKeys,
    getCheckboxProps: (item) => ({ disabled: disabled || item.disabled }),
});

const onChange = (nextTargetKeys: any) => {
    targetKeys.value = nextTargetKeys;

    enableButtonOpenDocumentCancelationDrawer.value = nextTargetKeys.length > 0;

    totalInvoicedAmountToCancel.value = invoices.value
        .filter((invoice) => {
            return nextTargetKeys.includes(invoice.id.toString());
        })
        .reduce((acc, item: any) => {
            if (item.previousPayment.length > 0) {
                return acc + parseFloat(item.import) - sumPreviousPayment(item);
            }
            return acc + item.import;
        }, 0);

    // Actualizar el array de IDs de facturas seleccionadas
    selectedInvoiceIds.value = nextTargetKeys.map((key: string) => key);

    // Actualizar las claves seleccionadas
    selectedKeys.value = nextTargetKeys;
};

watch(
    () => customer.value,
    () => {
        setinitialDataAtReceipt();
        targetKeys.value = [];
        selectedKeys.value = [];
    },
);

watch(
    () => isCreatedReceipt.value,
    (newVal) => {
        if (newVal) {
            setinitialDataAtReceipt();
            targetKeys.value = [];
            selectedKeys.value = [];
        }
    },
);

onUnmounted(() => {
    targetKeys.value = [];
    selectedKeys.value = [];
    setinitialDataAtReceipt();
});
</script>

<style scoped>
.new-receipt {
    padding-top: 2rem;
}
.button-filter-data {
    width: 100%;
    text-align: center;
}

#filter-data {
    display: flex;
    gap: 1rem;
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

@media (max-width: 768px) {
    .filter-data {
        flex-direction: column;
    }

    .filter-data > * {
        width: 100%;
    }
}
</style>
