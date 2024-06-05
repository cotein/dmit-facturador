import type { Sujeto } from './../../types/Company';
import { CUIT_ID } from '@/app/types/Constantes';
import type { CustomerForm, CustomerSelectComponent } from '@/app/types/Customer';

import { defineStore } from 'pinia';
import { computed, reactive, ref, type UnwrapRef } from 'vue';

export const useCustomerStore = defineStore( 'customer', () => {
	const lastNameIsRequired = ref<boolean>( true );

	const customers = ref( [] );

	const setCustomers = ( value: any ) => ( customers.value = value );

	const selectedCustomer = ref<CustomerSelectComponent>();

	const customerForm: UnwrapRef<CustomerForm> = reactive( {
		name: '',
		lastName: '',
		cuit: '',
		cuit_id: CUIT_ID,
		inscription: '',
		number: '',
		address: {
			state_id: '',
			city: '',
			street: '',
			cp: '',
			number: '',
			obs: '',
			between_streets: '',
			addressable_id: '',
			addressable_type: '',
		},
		afip_data: undefined,
		fantasy_name: '',
		type_customer: null,
		company_id: null,
	} );

	const clearData = () => {
		customerForm.name = '';
		customerForm.lastName = '';
		customerForm.inscription = '';
		customerForm.address.state_id = '';
		customerForm.address.city = '';
		customerForm.address.street = '';
		customerForm.address.cp = '';
		customerForm.address.number = '';
		customerForm.address.obs = '';
		customerForm.address.between_streets = '';
		customerForm.address.addressable_id = '';
		customerForm.address.addressable_type = '';
		customerForm.afip_data = undefined;
		customerForm.fantasy_name = '';
	};

	return {
		//State properties
		customers,
		customerForm,
		clearData,
		selectedCustomer,
		lastNameIsRequired,
		setCustomers,
		CustomersGetter: computed( () => customers.value ),
		//Actions
		//Getters
	};
} );
