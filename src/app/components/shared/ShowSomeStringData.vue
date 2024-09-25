<template>
    <div :class="customClass">
        <span>{{ SomeString }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
type Props = {
    string: string;
    index?: number;
    customClass?: string; // Define la prop para la clase CSS
};

const props = withDefaults(defineProps<Props>(), {
    string: undefined,
    index: undefined,
    customClass: '', // Valor por defecto para la clase CSS
});

const SomeString = computed(() => {
    return props.string;
});
</script>

<style scoped></style>
