<template>
    <p class="title">Categoría Padre</p>
    <a-input v-model:value="fatherCategory" placeholder="Basic usage" size="large" />
</template>
<script setup lang="ts">
import { ref } from 'vue';
const fatherCategory = ref<string>('');
</script>
<style scoped>
.title {
    text-align: left;
}
</style>
