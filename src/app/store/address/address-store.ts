import type { Address } from '@/app/types/Address';
import { defineStore, storeToRefs } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { useAfipStateStore } from '../afip/states-store';

export const useAddressStore = defineStore( 'address', () => {
	const provincias = useAfipStateStore();

	const { StatesGetter } = storeToRefs( provincias );

	const addressInStore = ref<Address>( {
		state_id: '',
		city: '',
		street: '',
		cp: '',
		number: '',
		obs: '',
		between_streets: '',
		addressable_id: '',
		addressable_type: '',
	} );

	const isValid = ref<boolean>( false );

	return {
		//State properties
		addressInStore,
		isValid,
		//Actions
		//Getters
		//Address: computed( () => address ),
		StatesGetter,
	};
} );
