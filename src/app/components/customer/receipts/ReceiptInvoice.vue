<template>
    <div>
        <!-- <a-table bordered :data-source="dataSource" :columns="columns">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'name'">
                    <div class="editable-cell">
                        <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
                            <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
                            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
                        </div>
                        <div v-else class="editable-cell-text-wrapper">
                            {{ text || ' ' }}
                            <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
                        </div>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="onDelete(record.key)">
                        <a>Delete</a>
                    </a-popconfirm>
                </template>
            </template>
        </a-table> -->
        {{ receiptInvoices }}
    </div>
</template>

<script setup lang="ts">
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';

const { receiptInvoices } = useReceiptComposable();

interface Column {
    title: string;
    dataIndex: string;
    width?: string;
}
const columns: Column[] = [
    {
        title: 'name',
        dataIndex: 'name',
        width: '30%',
    },
    {
        title: 'age',
        dataIndex: 'age',
    },
    {
        title: 'address',
        dataIndex: 'address',
    },
    {
        title: 'operation',
        dataIndex: 'operation',
    },
];
</script>

<style scoped></style>
