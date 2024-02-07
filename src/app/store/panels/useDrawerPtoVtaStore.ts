import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDrawerPtoVtaStore = defineStore('drawer-pto-vta', () => {
	const drawerPtoVtaIsVisible = ref<boolean>(false);

	const openDrawerPtoVta = () => {
		drawerPtoVtaIsVisible.value = true;
	};

	const closeDrawerPtoVta = () => {
		drawerPtoVtaIsVisible.value = false;
	};

	return {
		//State properties
		//Actions
		openDrawerPtoVta,
		closeDrawerPtoVta,
		drawerPtoVtaIsVisible,
		//Getters
		//DrawerPtoVtaIsVisible: computed(() => drawerPtoVtaIsVisible.value),
	};
});
