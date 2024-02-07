import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAddNewCompanyPanelStore = defineStore('AddNewCompanyPanelStore', () => {
	const addNewCompany = ref<boolean>(false);
	const editCompany = ref<boolean>(false);

	const openAddNewCompanyPanel = () => {
		addNewCompany.value = true;
	};

	const closeAddNewCompanyPanel = () => {
		addNewCompany.value = false;
	};

	const openEditCompanyPanel = () => {
		editCompany.value = true;
	};

	const closeEditCompanyPanel = () => {
		editCompany.value = false;
	};

	return {
		//State properties
		addNewCompany,
		//Actions
		openAddNewCompanyPanel,
		closeAddNewCompanyPanel,
		openEditCompanyPanel,
		closeEditCompanyPanel,
		//Getters
		AddNewCompany: computed(() => addNewCompany.value),
		EditCompanyPanel: computed(() => editCompany.value),
	};
});
