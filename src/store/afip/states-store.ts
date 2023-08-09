import type { AfipState } from '@/types/Afip';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAfipStateStore = defineStore('afip-states', () => {
	//State properties
	const states = ref<AfipState[]>([]);
	//Actions
	const setStatesAction = (value: AfipState[]) => {
		states.value = value;
	};
	//Getters
	return {
		//State properties
		//Actions
		setStatesAction,
		//Getters
		StatesGetter: computed(() => states.value),
	};
});
