import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
	const user = ref([]);
	const auth = ref<boolean>(false);
	//Actions
	const setUser = (value: any) => {
		user.value = value;
	};

	const setLogin = () => {
		auth.value = true;
	};

	const logout = () => {
		auth.value = false;
	};
	//Computed

	return {
		//State properties
		//Actions
		setUser,
		setLogin,
		logout,
		//Getters
		UserGetter: computed(() => user.value),
		Auth: computed(() => auth.value),
	};
});
