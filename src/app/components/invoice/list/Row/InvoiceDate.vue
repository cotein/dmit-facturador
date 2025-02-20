<template>
    <div v-if="isExpirated">
        <a-tooltip title="Factura vencida">
            <p class="isExpirated">
                {{ Date }}
            </p>
        </a-tooltip>
    </div>
    <div v-else>
        <p>
            {{ Date }}
        </p>
    </div>
</template>

<script setup lang="ts">
import Dayjs from 'dayjs';
import { computed } from 'vue';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { InvoiceList } from '@/app/types/Invoice';

Dayjs.extend(customParseFormat);

const CONTADO = 1;

type Props = {
    record: InvoiceList;
    index: number;
    date: string;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
    date: undefined,
});

const Date = computed(() => {
    const dateFormats = ['DD-MM-YYYY', 'YYYY-MM-DD'];
    return Dayjs(props.date, dateFormats).format('DD-MM-YYYY');
});

const isExpirated = computed(() => {
    return props.record?.voucher?.isExpirated && props.record?.voucher?.sale_conditions_id > CONTADO;
});
</script>

<style scoped>
div {
    text-align: center;
    width: 100%;
}
.isExpirated {
    color: whitesmoke;
    background-color: red;
    font-weight: bold;
}
</style>
