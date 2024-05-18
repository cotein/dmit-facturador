import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('store-base', () => {
	const config: {
		topMenu: boolean;
		rtl: boolean;
		darkMode: boolean;
		mainTemplate: string;
	} = {
		topMenu: false,
		rtl: false,
		darkMode: false,
		mainTemplate: 'lightMode',
	};

	const state = ref({
		data: config.darkMode,
		rtlData: config.rtl,
		topMenu: config.topMenu,
		main: config.mainTemplate,
		loading: false,
		rtlLoading: false,
		menuLoading: false,
		error: null,
	});

	return {
		//State properties
		state,
		//Actions
		//Getters
	};
});
