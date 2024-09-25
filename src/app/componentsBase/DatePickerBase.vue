<template>
    <a-date-picker
        v-model:value="internalValue"
        size="large"
        placeholder="Seleccionar Fecha"
        :format="'DD-MM-YYYY'"
        style="width: 100%"
        @change="handleChange"
    />
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue ? dayjs(props.modelValue, 'DD-MM-YYYY') : null);

watch(
    () => props.modelValue,
    (newValue) => {
        internalValue.value = newValue ? dayjs(newValue, 'DD-MM-YYYY') : null;
    },
);

const handleChange = (date: any) => {
    console.log('🚀 ~ handleChange ~ date:', date);
    const formattedDate = date ? dayjs(date).format('DD-MM-YYYY') : '';
    emit('update:modelValue', formattedDate);
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
</style>
