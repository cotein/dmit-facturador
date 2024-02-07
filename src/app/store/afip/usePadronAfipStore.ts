import type { PersonaReturn } from '@/app/types/Afip';
import type { CompanyRawData, Sujeto } from '@/app/types/Company';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const usePadronAfipStore = defineStore('afip-padron', () => {
	const sujeto = reactive({
		name: '',
		lastName: '',
		cuit: '',
		cuit_id: 0,
		inscription: 1,
		type_company: null,
		address: {
			state_id: 1,
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
	});

	const sujetoIsEditable = ref<boolean>(false);

	const clearSujetoData = () => {
		sujeto.name = '';
		sujeto.lastName = '';
		sujeto.cuit = '';
		sujeto.cuit_id = 0;
		sujeto.inscription = 1;
		sujeto.type_company = null;
		sujeto.address.state_id = 1;
		sujeto.address.city = '';
		sujeto.address.street = '';
		sujeto.address.cp = '';
		sujeto.address.number = '';
		sujeto.address.obs = '';
		sujeto.address.between_streets = '';
		sujeto.address.addressable_id = '';
		sujeto.address.addressable_type = '';
		sujeto.afip_data = {};
	};

	return {
		sujeto,
		clearSujetoData,
		sujetoIsEditable,
	};
});
