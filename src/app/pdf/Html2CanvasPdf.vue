<template>
    <div id="main_data"></div>
    <div id="html_0"></div>
    <div id="html_1"></div>
    <div id="html_2"></div>
    <div id="html_3"></div>
    <div id="html_4"></div>
    <div id="html_5"></div>
    <div id="html_6"></div>
    <div id="html_7"></div>
    <div id="html_8"></div>
    <div id="html_9"></div>
    <div id="html_10"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
    const divElement: HTMLElement | null = document.getElementById('main_data');

    if (divElement) {
        divElement.style.color = 'white'; // Cambia el color de la fuente a blanco
        divElement.innerHTML = '';
    }

    const divs: NodeListOf<HTMLDivElement> = document.querySelectorAll('[id^="html_"]');

    divs.forEach((div) => {
        //div.style.color = 'white'; // Cambia el color de la fuente a blanco
        div.innerHTML = ''; // Limpia el contenido interior si es necesario
    });
});
</script>

<style scoped>
div {
    margin-bottom: 2rem;
    width: 756px;
}
</style>
