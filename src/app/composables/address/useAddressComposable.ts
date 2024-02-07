import { useAddressStore } from '@/app/store/address/address-store';
import { storeToRefs } from 'pinia';

const { address, isValid, StatesGetter, Address } = storeToRefs(useAddressStore());

export const useAddressComposable = () => {
	return {
		//State properties
		address,
		isValid,
		//Actions
		//Getters
		Address,
		StatesGetter,
	};
};
