import type { Address } from '@/types/Address';
import { defineStore, storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useAfipStateStore } from '../afip/states-store';

export const useAddressStore = defineStore('Address', () => {
	const provincias = useAfipStateStore();

	const { StatesGetter } = storeToRefs(provincias);

	const address = ref<Address>({
		state_id: '',
		city: '',
		street: '',
		cp: '',
		number: '',
		obs: '',
		between_streets: '',
		addressable_id: '',
		addressable_type: '',
	});

	const isValid = ref<boolean>(false);

	return {
		//State properties
		address,
		isValid,
		//Actions
		//Getters
		StatesGetter,
	};
});
