<template>
    <div>
        <a-input
            @input="onInput"
            :value="modelValue"
            class="custom--input fixed-width"
            @keypress="onlyNumeric"
            @focus="selectText"
            inputmode="numeric"
            @blur="formatCurrency"
            @change="formatCurrency"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, withDefaults, defineEmits } from 'vue';
import { onlyNumeric, selectText } from '@/app/helpers/onlyNumbers';

type Props = {
    modelValue: any;
};

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
});

const emit = defineEmits(['update:modelValue']);

const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emit('update:modelValue', parseFloat(target.value));
};

const formatCurrency = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);

    if (!isNaN(value)) {
        target.value = new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(value);

        emit('update:modelValue', target.value);
    }
};

onMounted(() => {
    emit(
        'update:modelValue',
        new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(props.modelValue),
    );
});
</script>

<style scoped>
div {
    text-align: right;
    width: 100%;
}
.fixed-width {
    width: 100%; /* replace with your desired width */
    text-align: right;
}
</style>
