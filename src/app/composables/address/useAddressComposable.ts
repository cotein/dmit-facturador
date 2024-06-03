import { useAddressStore } from '@/app/store/address/address-store';
import { storeToRefs } from 'pinia';

const { isValid, StatesGetter } = storeToRefs( useAddressStore() );

export const useAddressComposable = () => {
	return {
		//State properties
		isValid,
		//Actions
		//Getters
		StatesGetter,
	};
};
