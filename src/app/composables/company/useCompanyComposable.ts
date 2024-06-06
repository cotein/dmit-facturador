import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';
import { notification } from 'ant-design-vue';
import { ref, reactive } from 'vue';
import { saveCompany, updateCompany } from '@/api/company/company-api';
import { storeToRefs } from 'pinia';
import { useAddNewCompanyPanelComposable } from '@/app/composables/panels/useAddNewCompanyPanelComposable';
import { useAddressStore } from '@/app/store/address/address-store';
import { useMutation } from '@tanstack/vue-query';
import { useStoreCompany } from '@/app/store/company/store-company';
import { useUserComposable } from '../user/useUserComposable';
import type { Rule } from '@/app/types/ValidationRule';
import { showMessage } from '@/app/helpers/mesaages';

const { CompanyGetter, companyForm, company } = storeToRefs( useStoreCompany() );
const { setUserCompanies } = useUserComposable();
const { setCompanyToWork, setCompany } = useStoreCompany();
const { closeAddNewCompanyPanel } = useAddNewCompanyPanelComposable();

const addressStore = useAddressStore();

const lastNameIsRequired = ref<boolean>( true );

const rules = reactive<Record<string, Rule[]>>( {
	name: [
		{
			required: true,
			message: 'El nombre es requerido',
			trigger: 'blur',
		},
		/* 	{
			min: 4,
			max: 100,
			message: 'El nombre debe contener entre 4 y 15 caracteres',
			trigger: 'blur',
		}, */
	],
	lastName: [
		{
			required: lastNameIsRequired.value,
			message: 'El Apellido es requerido',
			trigger: 'blur',
		},
	],
	cuit: [
		{
			required: true,
			message: 'La CUIT es requerida',
			trigger: 'blur',
		},
		{
			min: 11,
			max: 11,
			message: 'La CUIT debe tener 11 dígitos',
			trigger: 'blur',
		},
		{
			message: 'La CUIT debe poseer sólo números',
			validator: ( _: any, value: any ) => {
				const number = Number( value );
				if ( Number.isNaN( number ) ) {
					return Promise.reject();
				}
				return Promise.resolve();
			},
		},
	],
	inscription: [
		{
			required: true,
			message: 'La inscripción en Afip es requerida',
			trigger: 'blur',
		},
	],
	billing_concept: [
		{
			required: true,
			message: 'El concepto de facturación es requerido',
			trigger: 'blur',
		},
	],
	iibb: [
		{
			required: true,
			message: 'El número de Ingresos Brutos es requerido',
			trigger: 'blur',
		},
	],
	activity_init: [
		{
			required: true,
			message: 'La fecha de inicio de actividades es requerida',
			trigger: 'blur',
		},
	],
	type_company: [
		{
			required: true,
			message: 'El tipo de Compañía es requerido',
			trigger: 'blur',
		},
	],
	address: [
		{
			required: true,
			message: 'Debe ingresar un domicilio válido',
			validator: () => {
				if ( addressStore.isValid ) {
					return Promise.resolve();
				}
				return Promise.reject();
			},
		},
	],
} );

export const useCompanyComposable = () => {
	const createCompanyMutation = useMutation( {
		mutationFn: saveCompany,

		onSuccess: ( response ) => {
			setUserCompanies( response.data );
			if ( response.data.length === 1 ) {
				setCompanyToWork( response.data[ 0 ] );
			}

			setTimeout( () => {
				closeAddNewCompanyPanel();
			}, 2000 );

			showMessage( 'success', 'Compañía creada correctamente', 2 );
		},
	} );

	const updateCompanyMutation = useMutation( {
		mutationFn: updateCompany,
		onSuccess: ( response ) => {
			setUserCompanies( response.data );
			setCompanyToWork( response.data[ 0 ] );
			showMessage( 'success', 'Compañía actualizada correctamente', 2 );
		},
		onError: ( error: any ) => {
			showMessage( 'error', `Error al actualizar la compañía: `, 2 );
		},
	} );

	return {
		company,
		companyForm,
		CompanyGetter,
		createCompanyMutation,
		lastNameIsRequired,
		rules,
		setCompany,
		setCompanyToWork,
		updateCompanyMutation,
	};
};
