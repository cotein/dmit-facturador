<template>
    <a-popconfirm
        title="Cambiar a modo oscuro"
        ok-text="Sí"
        cancel-text="No"
        @confirm="setDarkMode"
        @cancel="setDarkMode"
    >
        <a href="#">
            <span>
                <font-awesome-icon :icon="faSun" size="1x" />
                <font-awesome-icon :icon="faArrowRight" size="1x" />
                <font-awesome-icon :icon="faMoon" size="1x" />
            </span>
        </a>
    </a-popconfirm>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { faMoon, faSun, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useDarkModeComposable } from '@/app/composables/config/useDarkModeComposable';

const darkMode = ref<boolean>(false);

const { setDarkMode, DarkModeGetter } = useDarkModeComposable();
</script>

<style scoped>
span svg {
    padding: 0 0.1rem;
}
</style>
