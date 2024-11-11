<template>
    <SelectedBankBase
        :index="props.index"
        :size="props.size"
        v-model="selectedBank"
        @update:modelValue="handleUpdateModelValue"
    />
</template>
<script setup lang="ts">
import SelectedBankBase from '@/app/componentsBase/SelectedBankBase.vue';
import { ref, defineEmits } from 'vue';

type Props = {
    index?: number;
    size?: 'default' | 'small' | 'large';
};

const props = defineProps<Props>();

const selectedBank = ref<number | null>(null);
const emit = defineEmits(['update:modelValue']);
const handleUpdateModelValue = (newValue: number | null) => {
    selectedBank.value = newValue;
    emit('update:modelValue', newValue);
};
</script>
