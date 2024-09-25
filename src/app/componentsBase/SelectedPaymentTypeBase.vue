<template>
    <a-select
        v-model="internalValue"
        placeholder="Modo de pago"
        style="width: 100%"
        :default-active-first-option="false"
        :field-names="{ label: 'name', value: 'id' }"
        :options="PaymentTypesGetter"
        :size="props.size ? props.size : 'default'"
        @change="handleChange"
    ></a-select>
</template>

<script setup lang="ts">
import { usePaymentTypeComposable } from '@/app/composables/payment-type/usePaymentTypeComposable';
import type { PaymentType } from '@/app/types/PaymentType';
import { ref, defineProps, toRefs, watch, defineEmits } from 'vue';

const { PaymentTypesGetter } = usePaymentTypeComposable();

interface Props {
    index?: number;
    size?: 'default' | 'small' | 'large';
    modelValue: number | null; // Asegúrate de que modelValue sea del tipo correcto
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
const { modelValue } = toRefs(props);

const internalValue = ref<number | null>(modelValue.value);

const handleChange = (value: any) => {
    emit('update:modelValue', value);
};
</script>
