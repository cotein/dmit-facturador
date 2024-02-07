import type { Category, CategoryRawData } from '@/app/types/Category';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useCategoryStore = defineStore('categories', () => {
	const categories = ref<Category[]>([]); //se utiliza para los componentes cascader

	const rawCategories = ref<CategoryRawData[]>([]);

	const setCategories = (value: Category[]) => {
		categories.value = value;
	};

	return {
		//State properties
		//Actions
		setCategories,
		rawCategories,
		//Getters
		CategoriesGetter: computed(() => categories.value),
	};
});
