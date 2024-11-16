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
        :showSearch="props.showSearch"
        :filterOption="filterOption"
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
    showSearch?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showSearch: true,
});

const { modelValue } = toRefs(props);

const internalValue = ref<number | null>(modelValue.value);

const emit = defineEmits(['update:modelValue']);

const handleChange = (value: any) => {
    emit('update:modelValue', value);
};

const filterOption = (input: string, option: any) => {
    return option.name.toLowerCase().includes(input.toLowerCase());
};
</script>
