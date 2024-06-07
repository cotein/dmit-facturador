<template>
    <div class="cc--content">
        <h3 class="ninjadash-card-title-wrap">Cliente: {{ props.customerCuentaCorriente[0].customer }}</h3>
        <a-table
            :columns="columns"
            :data-source="props.customerCuentaCorriente"
            :pagination="false"
            row-key="id"
            :bordered="false"
        >
            <template #headerCell="{ title }">
                <div style="text-align: center">{{ title }}</div>
            </template>

            <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'voucher'">
                    <CuentaCorrienteVoucher :record="record" />
                </template>
                <template v-if="column.key === 'sale'">
                    <CuentaCorrienteValue :record="record" :sale="true" />
                </template>
                <template v-if="column.key === 'pay'">
                    <CuentaCorrienteValue :record="record" />
                </template>
            </template>
            <template #footer>
                <div class="footer">
                    <div class="sale">Total ventas {{ $filters.formatCurrency(TotalSaleComputed) }}</div>
                    <div class="pay">Total Pagos {{ $filters.formatCurrency(TotalPayComputed) }}</div>
                    <div class="pay">Saldo {{ $filters.formatCurrency(TotalSaleComputed - TotalPayComputed) }}</div>
                </div>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CuentaCorrienteValue from './CuentaCorrienteValue.vue';
import CuentaCorrienteVoucher from './CuentaCorrienteVoucher.vue';

interface Props {
    customerCuentaCorriente: [];
}

const TotalSaleComputed = computed(() => {
    return props.customerCuentaCorriente.reduce((acc, item: any) => {
        return acc + parseFloat(item.sale);
    }, 0);
});

const TotalPayComputed = computed(() => {
    return props.customerCuentaCorriente.reduce((acc, item: any) => {
        return acc + parseFloat(item.pay);
    }, 0);
});
const props = defineProps<Props>();

const columns = [
    {
        title: 'F. Emisión',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
        width: '15%',
    },
    {
        title: 'Comprobante',
        dataIndex: 'voucher',
        key: 'voucher',
    },
    {
        title: 'Venta',
        dataIndex: 'sale',
        key: 'sale',
        align: 'right',
        width: '20%',
    },
    {
        title: 'Pagó',
        dataIndex: 'pay',
        key: 'pay',
        align: 'right',
        width: '20%',
    },
];
</script>

<style scoped>
.footer {
    display: flex;
    justify-content: space-around;
}
.cc--content {
    border-radius: 10px 10px 10px 10px;
    -webkit-border-radius: 10px 10px 10px 10px;
    -moz-border-radius: 10px 10px 10px 10px;
}
.cc--content h3 {
    padding: 1rem;
}
</style>
