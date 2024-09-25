<template>
    <SelectedPaymentTypeBase
        :index="props.index"
        :size="props.size"
        v-model="selectedPaymentType"
        @update:modelValue="handleUpdateModelValue"
    />
</template>

<script setup lang="ts">
import SelectedPaymentTypeBase from '@/app/componentsBase/SelectedPaymentTypeBase.vue';
import type { PaymentType } from '@/app/types/PaymentType';
import { useReceiptComposable } from '@/app/composables/receipt/useReceiptComposable';
import { ref, defineProps, defineEmits } from 'vue';

const { documentsCancelation } = useReceiptComposable();

type Props = {
    index?: number;
    size?: 'default' | 'small' | 'large';
};

const props = defineProps<Props>();

const selectedPaymentType = ref<number | null>(null);
const emit = defineEmits(['update:modelValue']);
const handleUpdateModelValue = (newValue: number | null) => {
    selectedPaymentType.value = newValue;
    emit('update:modelValue', newValue);
};
</script>
