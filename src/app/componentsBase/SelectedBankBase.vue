<template>
    <a-select
        v-model:value="internalValue"
        placeholder="Banco"
        style="width: 100%"
        :default-active-first-option="false"
        :field-names="{ label: 'name', value: 'id' }"
        :options="banks"
        :size="props.size ? props.size : 'default'"
        :allowClear="true"
        @change="handleChange"
    ></a-select>
</template>
<script setup lang="ts">
import { ref, defineProps, toRefs, watch, defineEmits } from 'vue';
import { useBankComposable } from '@/app/composables/bank/useBankComposable';
import type { Bank } from '../types/Bank';

const { banks } = useBankComposable();

interface Props {
    index?: number;
    size?: 'default' | 'small' | 'large';
    modelValue: number | null; // Asegúrate de que modelValue sea del tipo correcto
}

const props = defineProps<Props>();
const { modelValue } = toRefs(props);
const internalValue = ref<number | null>(modelValue.value);
const emit = defineEmits(['update:modelValue']);

const handleChange = (value: any) => {
    emit('update:modelValue', value);
};
</script>
