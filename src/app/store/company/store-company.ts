import type { Company, CompanyRawData } from '@/app/types/Company';
import moment from 'moment';
import { CUIT_ID } from '@/app/types/Constantes';
import { defineStore, storeToRefs } from 'pinia';
import { ref, computed, reactive, type UnwrapRef } from 'vue';
import { useAddressStore } from '../address/address-store';

export const useStoreCompany = defineStore( 'company', () => {
	const company = ref<Company>();

	const addressStore = useAddressStore();

	const companyForm: UnwrapRef<CompanyRawData> = reactive( {
		name: '',
		lastName: '',
		cuit: '',
		cuit_id: CUIT_ID,
		inscription: '',
		number: '',
		activity_init: '',
		iibb: '',
		afip_environment: 'production',
		type_company: null,
		perception_iibb: false,
		perception_iva: false,
		pto_vta_fe: null,
		pto_vta_remito: null,
		pto_vta_recibo: null,
		billing_concept: '1',
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
	} );

	const defaultCompanyForm = {
		activity_init: '',
		afip_data: undefined,
		afip_environment: 'production',
		billing_concept: '1',
		cuit: '',
		cuit_id: CUIT_ID,
		fantasy_name: '',
		iibb: '',
		inscription: '',
		lastName: '',
		name: '',
		number: '',
		perception_iibb: false,
		perception_iva: false,
		pto_vta_fe: null,
		pto_vta_recibo: null,
		pto_vta_remito: null,
		type_company: null,
	};

	const defaultAddressInStore = {
		state_id: '',
		city: '',
		street: '',
		cp: '',
		number: '',
		obs: '',
		between_streets: '',
		addressable_id: '',
		addressable_type: '',
	};

	const clearCompanyForm = () => {
		Object.assign( companyForm, defaultCompanyForm );
		Object.assign( addressStore.addressInStore, defaultAddressInStore );
	};

	const setCompanyToWork = ( value: Company ) => {
		company.value = value;
	};

	const setCompany = ( company: Company ) => {
		Object.assign( companyForm, {
			...defaultCompanyForm,
			activity_init: moment( company.activity_init ),
			afip_environment: company.afip_environment,
			billing_concept: String( company.billing_concept ),
			cuit: company.cuit,
			cuit_id: company.cuit_id,
			fantasy_name: company.fantasy_name,
			iibb: company.iibb,
			inscription: company.inscription,
			lastName: company.lastName,
			name: company.name,
			number: company.number,
			perception_iibb: Number( company.perception_iibb ) === 1 ? true : false,
			perception_iva: Number( company.perception_iva ) === 1 ? true : false,
			pto_vta_fe: company.pto_vta_fe,
			pto_vta_recibo: company.pto_vta_recibo,
			pto_vta_remito: company.pto_vta_remito,
			type_company: company.type_company,
		} );

		Object.assign( addressStore.addressInStore, {
			...defaultAddressInStore,
			state_id: company.address.state_id,
			city: company.address.city,
			street: company.address.street,
			cp: company.address.cp,
			number: company.address.number,
			obs: company.address.obs,
			between_streets: company.address.between_streets,
			addressable_id: company.address.addressable_id,
			addressable_type: company.address.addressable_type,
		} );
	};
	return {
		//State properties
		companyForm,
		company,
		//Actions
		setCompanyToWork,
		setCompany,
		//Getters
		CompanyGetter: computed( () => company.value ),
		clearCompanyForm,
	};
} );
