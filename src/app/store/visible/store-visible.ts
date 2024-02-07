import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useVisibleStore = defineStore('visible', () => {
	const visible = ref<boolean>(false);

	const setVisible = (value: boolean) => {
		visible.value = value;
	};

	return {
		//State properties
		visible,
		setVisible,
		//Actions
		//Getters
		VisibleGetter: computed(() => visible.value),
	};
});
