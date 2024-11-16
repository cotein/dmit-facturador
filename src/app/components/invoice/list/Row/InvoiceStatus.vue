<template>
    <div>
        <a-tag :color="StatusColor" class="custom-tag">{{ Status }}</a-tag>
    </div>
</template>

<script setup lang="ts">
import type { InvoiceList } from '@/app/types/Invoice';
import { computed } from 'vue';

type Props = {
    record: InvoiceList;
    index: number;
};

const props = withDefaults(defineProps<Props>(), {
    record: undefined,
    index: undefined,
});

const Status = computed(() => {
    switch (props.record.voucher!.status) {
        case 1:
            return 'ADEUDA';
        case 2:
            return 'PAR. CANCELADA';
        case 3:
            return 'CANCELADA';
        default:
            throw new Error(`No existe este Status`);
    }
});

const StatusColor = computed(() => {
    switch (props.record.voucher!.status) {
        case 1:
            return '#e717259f';
        case 2:
            return '#FFC94A';
        case 3:
            return '#36BA98';
        default:
            throw new Error(`No existe este Status`);
    }
});
</script>

<style scoped>
div {
    text-align: center;
    width: 100%;
    color: #50504d;
}
</style>
