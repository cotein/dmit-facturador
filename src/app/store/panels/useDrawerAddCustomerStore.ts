import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDrawerAddCustomerStore = defineStore('drawer-add-customer', () => {
	const drawerAddCustomerIsVisible = ref<boolean>(false);

	const openDrawerAddCustomer = () => {
		drawerAddCustomerIsVisible.value = true;
	};

	const closeDrawerAddCustomer = () => {
		drawerAddCustomerIsVisible.value = false;
	};

	return {
		//State properties
		//Actions
		openDrawerAddCustomer,
		closeDrawerAddCustomer,
		drawerAddCustomerIsVisible,
		//Getters
		//DrawerAddCustomerIsVisible: computed(() => drawerAddCustomerIsVisible.value),
	};
});
