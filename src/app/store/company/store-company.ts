import type { Company, CompanyRawData } from '@/app/types/Company';
import moment from 'moment';
import { CUIT_ID } from '@/app/types/Constantes';
import { defineStore, storeToRefs } from 'pinia';
import { ref, computed, reactive, type UnwrapRef } from 'vue';
import { useAddressStore } from '../address/address-store';

export const useStoreCompany = defineStore('company', () => {
	const company = ref<Company>();

	const addressStore = useAddressStore();

	const companyForm: UnwrapRef<CompanyRawData> = reactive({
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
		afip_data: {},
		fantasy_name: '',
	});

	const clearCompanyForm = () => {
		companyForm.activity_init = '';
		/* companyForm.address.addressable_id = '';
		companyForm.address.addressable_type = '';
		companyForm.address.between_streets = '';
		companyForm.address.city = '';
		companyForm.address.cp = '';
		companyForm.address.number = '';
		companyForm.address.obs = '';
		companyForm.address.state_id = '';
		companyForm.address.street = ''; */

		addressStore.address.state_id = '';
		addressStore.address.city = '';
		addressStore.address.street = '';
		addressStore.address.cp = '';
		addressStore.address.number = '';
		addressStore.address.obs = '';
		addressStore.address.between_streets = '';
		addressStore.address.addressable_id = '';
		addressStore.address.addressable_type = '';

		companyForm.afip_data = {};
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
	};

	const setCompanyToWork = (value: Company) => {
		company.value = value;
	};

	const setCompany = (data: CompanyRawData) => {
		companyForm.activity_init = moment(data.activity_init);
		/* companyForm.address.addressable_id = data.address.addressable_id;
		companyForm.address.addressable_type = data.address.addressable_type;
		companyForm.address.between_streets = data.address.between_streets;
		companyForm.address.city = data.address.city;
		companyForm.address.cp = data.address.cp;
		companyForm.address.number = data.address.number;
		companyForm.address.obs = data.address.obs;
		companyForm.address.state_id = data.address.state_id;
		companyForm.address.street = data.address.street; */

		addressStore.address.state_id = data.address.state_id;
		addressStore.address.city = data.address.city;
		addressStore.address.street = data.address.street;
		addressStore.address.cp = data.address.cp;
		addressStore.address.number = data.address.number;
		addressStore.address.obs = data.address.obs;
		addressStore.address.between_streets = data.address.between_streets;
		addressStore.address.addressable_id = data.address.addressable_id;
		addressStore.address.addressable_type = data.address.addressable_type;

		companyForm.afip_data = {};
		companyForm.afip_environment = data.afip_environment;
		companyForm.billing_concept = String(data.billing_concept);
		companyForm.cuit = data.cuit;
		companyForm.cuit_id = data.cuit_id;
		companyForm.fantasy_name = data.fantasy_name;
		companyForm.iibb = data.iibb;
		companyForm.inscription = data.inscription;
		companyForm.lastName = data.lastName;
		companyForm.name = data.name;
		companyForm.number = data.number;
		companyForm.perception_iibb = data.perception_iibb;
		companyForm.perception_iva = data.perception_iva;
		companyForm.pto_vta_fe = data.pto_vta_fe;
		companyForm.pto_vta_recibo = data.pto_vta_recibo;
		companyForm.pto_vta_remito = data.pto_vta_remito;
		companyForm.type_company = data.type_company;
	};

	return {
		//State properties
		companyForm,
		company,
		//Actions
		setCompanyToWork,
		setCompany,
		//Getters
		CompanyGetter: computed(() => company.value),
		clearCompanyForm,
	};
});
