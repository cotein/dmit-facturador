<template>
    <div>
        <span class="product-total-price">{{ Date }}</span>
    </div>
</template>

<script setup lang="ts">
import Dayjs from 'dayjs';
import { computed } from 'vue';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { InvoiceList } from '@/app/types/Invoice';

Dayjs.extend(customParseFormat);

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
</script>

<style scoped>
div {
    text-align: center;
    width: 100%;
}
</style>
