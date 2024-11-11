<template>
    <a-range-picker
        style="width: 100%"
        :format="dateFormat"
        v-model:value="dates"
        :placeholder="['Fecha inicial', 'Fecha final']"
        @change="handleChange"
        :locale="localeObject"
        :size="size"
    />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import { localeObject } from '@/app/config/date-picker-settings';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const props = defineProps({
    modelValue: {
        type: Array as unknown as () => [Dayjs, Dayjs] | null,
        default: null,
    },
    dateFormat: {
        type: String,
        default: 'DD/MM/YYYY',
    },
    size: {
        type: String as () => 'small' | 'default' | 'large',
        default: 'small',
    },
});

const emit = defineEmits(['update:modelValue', 'change']);

const dates = ref<[Dayjs, Dayjs] | null>(props.modelValue);

const handleChange = (date: [Dayjs, Dayjs] | null) => {
    dates.value = date;
    emit('update:modelValue', date);
    emit('change', date);
};
</script>

<style scoped></style>
