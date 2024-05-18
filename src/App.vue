<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ThemeProvider } from 'vue3-styled-components';
import { themeColor } from './config/theme/themeVariables';
import { computed, onMounted } from 'vue';
import { useAppStore } from './app/store/app/useAppStore';
import 'v-calendar/dist/style.css';

const { state } = useAppStore();
const rtl = computed(() => state.rtlData);
const isLoading = false;
const darkMode = computed(() => state.data);
const topMenu = computed(() => state.topMenu);
const mainContent = computed(() => state.main);

onMounted(() => {
	window.addEventListener('load', () => {
		const domHtml = document.getElementsByTagName('html')[0];
		rtl.value ? domHtml.setAttribute('dir', 'rtl') : domHtml.setAttribute('dir', 'ltr');
		darkMode.value ? document.body.classList.add('dark-mode') : '';
	});
});
</script>
<template>
	<div v-if="isLoading" class="spin">
		<a-spin />
	</div>
	<ThemeProvider
		v-else
		:theme="{
			rtl,
			topMenu,
			darkMode,
			mainContent,
			...themeColor,
		}"
	>
		<Suspense>
			<template #default>
				<RouterView />
			</template>
			<template #fallback>
				<div class="spin">
					<a-spin />
				</div>
			</template>
		</Suspense>
	</ThemeProvider>
</template>
<style lang="css">
.fade-enter-active,
.fade-leave-active {
	transition: opacity 1;
}
.fade-enter,
.fade-leave-to {
	transition: opacity 0;
}
</style>
