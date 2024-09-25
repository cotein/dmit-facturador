<template>
    <div id="main_data" class="off-screen"></div>
    <div id="html_0" class="off-screen"></div>
    <div id="html_1" class="off-screen"></div>
    <div id="html_2" class="off-screen"></div>
    <div id="html_3" class="off-screen"></div>
    <div id="html_4" class="off-screen"></div>
    <div id="html_5" class="off-screen"></div>
    <div id="html_6" class="off-screen"></div>
    <div id="html_7" class="off-screen"></div>
    <div id="html_8" class="off-screen"></div>
    <div id="html_9" class="off-screen"></div>
    <div id="html_10" class="off-screen"></div>
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
.off-screen {
    position: absolute;
    left: -9999px;
}
</style>
