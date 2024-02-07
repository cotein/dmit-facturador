import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDarkModeStore = defineStore('dark-mode', () => {
	const darkMode = ref<boolean>(false);

	const setDarkMode = () => (darkMode.value = !darkMode.value);

	const DarkModeGetter = computed(() => darkMode.value);

	return {
		//State properties
		//Actions
		setDarkMode,
		//Getters
		DarkModeGetter,
	};
});
