<template></template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';

const date = ref();

const appendZero = function (number: number) {
    return Number(number) < 10 ? '0' + number : number;
};

const disabledDate = (current: Dayjs) => {
    let days = 10;

    if (props.data.voucher.concepto === 1) days = 5;

    return (current && current < dayjs().subtract(days, 'day')) || current > dayjs().add(days, 'day');
};

const changeDate = (date: Dayjs) => {
    if (date) {
        CbteFch.value = date.format('YYYYMMDD');
    } else {
        CbteFch.value = '';
    }
};
</script>

<style scoped></style>
