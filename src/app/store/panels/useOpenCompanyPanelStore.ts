import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useOpenCompanyPanelStore = defineStore('useOpenCompanyPanelStore', () => {
	const openPanelWithMyCompanies = ref<boolean>(false);

	const openPanelCompanies = () => {
		console.log('🚀 ~ file: useOpenCompanyPanelStore.ts:10 ~ openPanelCompanies ~ openPanelCompanies:');
		openPanelWithMyCompanies.value = true;
	};
	const closePanelCompanies = () => {
		openPanelWithMyCompanies.value = false;
	};

	return {
		//State properties
		//Actions
		openPanelCompanies,
		closePanelCompanies,
		//Getters
		OpenPanelWithMyCompanies: computed(() => openPanelWithMyCompanies.value),
	};
});
