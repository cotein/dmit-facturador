<template>
    <a-date-picker
        v-model="internalDate"
        :disabled-date="disabledDate"
        :format="dateFormat"
        @change="handleChange"
        style="width: 100%"
    />
</template>

<script setup lang="ts">
import { ref, defineProps, watch, defineEmits, PropType } from 'vue';
import dayjs, { type Dayjs } from 'dayjs';

const props = defineProps({
    modelValue: {
        type: [String, Object] as PropType<string | Dayjs>,
        default: () => dayjs().format('DD-MM-YYYY'),
    },
    dateFormat: {
        type: String,
        default: 'DD-MM-YYYY',
    },
    extraLogic: {
        type: Function as PropType<(date: Dayjs) => void>,
        default: null,
    },
    disabledDate: {
        type: Function as PropType<(current: Dayjs) => boolean>,
        default: () => false,
    },
});

const emit = defineEmits(['update:modelValue']);
const internalDate = ref(props.modelValue);

watch(internalDate, (newDate) => {
    emit('update:modelValue', newDate);
});

const handleChange = (date: Dayjs) => {
    if (props.extraLogic) {
        props.extraLogic(date);
    }
};
</script>

<style scoped></style>
