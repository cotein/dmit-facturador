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

	/* const clearCompanyForm = () => {
		companyForm.activity_init = '';


		addressStore.addressInStore.state_id = '';
		addressStore.addressInStore.city = '';
		addressStore.addressInStore.street = '';
		addressStore.addressInStore.cp = '';
		addressStore.addressInStore.number = '';
		addressStore.addressInStore.obs = '';
		addressStore.addressInStore.between_streets = '';
		addressStore.addressInStore.addressable_id = '';
		addressStore.addressInStore.addressable_type = '';

		companyForm.afip_data = undefined;
		companyForm.afip_environment = 'production';
		companyForm.billing_concept = '1';
		companyForm.cuit = '';
		companyForm.cuit_id = CUIT_ID;
		companyForm.fantasy_name = '';
		companyForm.iibb = '';
		companyForm.inscription = '';
		companyForm.lastName = '';
		companyForm.name = '';
		companyForm.number = '';
		companyForm.perception_iibb = false;
		companyForm.perception_iva = false;
		companyForm.pto_vta_fe = null;
		companyForm.pto_vta_recibo = null;
		companyForm.pto_vta_remito = null;
		companyForm.type_company = null;
	}; */

	/* const setCompanyToWork = ( value: Company ) => {
		company.value = value;
	}; */

	/* const setCompany = ( company: Company ) => {
		companyForm.activity_init = moment( company.activity_init );


		addressStore.addressInStore.state_id = company.address.state_id;
		addressStore.addressInStore.city = company.address.city;
		addressStore.addressInStore.street = company.address.street;
		addressStore.addressInStore.cp = company.address.cp;
		addressStore.addressInStore.number = company.address.number;
		addressStore.addressInStore.obs = company.address.obs;
		addressStore.addressInStore.between_streets = company.address.between_streets;
		addressStore.addressInStore.addressable_id = company.address.addressable_id;
		addressStore.addressInStore.addressable_type = company.address.addressable_type;

		companyForm.afip_data = undefined;
		companyForm.afip_environment = company.afip_environment;
		companyForm.billing_concept = String( company.billing_concept );
		companyForm.cuit = company.cuit;
		companyForm.cuit_id = company.cuit_id;
		companyForm.fantasy_name = company.fantasy_name;
		companyForm.iibb = company.iibb;
		companyForm.inscription = company.inscription;
		companyForm.lastName = company.lastName;
		companyForm.name = company.name;
		companyForm.number = company.number;
		companyForm.perception_iibb = company.perception_iibb;
		companyForm.perception_iva = company.perception_iva;
		companyForm.pto_vta_fe = company.pto_vta_fe;
		companyForm.pto_vta_recibo = company.pto_vta_recibo;
		companyForm.pto_vta_remito = company.pto_vta_remito;
		companyForm.type_company = company.type_company;
	}; */

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
			perception_iibb: company.perception_iibb,
			perception_iva: company.perception_iva,
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
