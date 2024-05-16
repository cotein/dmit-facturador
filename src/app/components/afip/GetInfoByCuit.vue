<script setup lang="ts">
import { reactive, ref, type UnwrapRef } from 'vue';
import { usePadronComposable } from '@/app/composables/afip/usePadronComposable';
import { apiAfipGetCompanyDataByCuit } from '@/api/afip/afip-padron';
import { message } from 'ant-design-vue';
import { TypeCompany } from '@/app/types/Company';
import type { DomicilioFiscal, Impuesto } from '@/app/types/Afip';
import { useAddressStore } from '@/app/store/address/address-store';

const addressStore = useAddressStore();

interface Props {
	onlyCuit: boolean;
}
type persona = {
	cuit: number | string;
};
const hombre: UnwrapRef<persona> = reactive({
	cuit: '',
});

const RESPONSABLE_INSCRIPTO = 1;

const MONOTRIBUTO = 6;

const CONSUMIDOR_FINAL = 5;

const EXENTO = 4;

const hasMoreThanOneResult = ref<boolean>(false);

const listPerson = ref<number[]>([]);
const search = ref<boolean>(false);
const afipGetPersonForm = ref();

const props = withDefaults(defineProps<Props>(), {
	onlyCuit: false,
});

const { sujeto, sujetoIsEditable } = usePadronComposable();

const validateCuit = (rule: any, value: any) => {
	return new Promise((resolve, reject) => {
		const number = Number(value);
		if (Number.isNaN(number)) reject('La CUIT debe poseer sólo números');
		if (props.onlyCuit && String(value).length != 11) reject('La CUIT debe tenes 11 número');
		if (value === '' || value === undefined) reject('La CUIT es requerida');
		resolve(true);
	});
};

const setAfipInscriptionType = (personaReturn: any) => {
	personaReturn.datosRegimenGeneral.impuesto.map((impuesto: Impuesto) => {
		if (impuesto.descripcionImpuesto === 'IVA') {
			sujeto.value.inscription = RESPONSABLE_INSCRIPTO;
		}
		if (impuesto.descripcionImpuesto === 'IVA EXENTO') {
			sujeto.value.inscription = EXENTO;
		}
	});
};

const setAfipAddress = (address: DomicilioFiscal) => {
	if (addressStore.address.hasOwnProperty('localidad')) {
		addressStore.address.city = address.localidad;
	} else {
		addressStore.address.city = address.descripcionProvincia;
	}

	addressStore.address.cp = address.codPostal;
	addressStore.address.state_id = address.idProvincia;
	addressStore.address.street = address.direccion;
	addressStore.isValid = true;
};

const getInfo = () => {
	afipGetPersonForm.value.validate().then(async () => {
		search.value = true;

		if (hasMoreThanOneResult.value) {
			hasMoreThanOneResult.value = false;
			listPerson.value = [];
		}

		const personaReturn = await apiAfipGetCompanyDataByCuit(sujeto.value.cuit).catch((err) => {
			search.value = false;
			const { data } = err.response.data;
			message.error({
				content: () => data.message,
				duration: 6,
				style: {
					color: 'red',
					fontSize: 'large',
				},
			});
		});

		if (personaReturn) {
			search.value = false;

			if (personaReturn.idPersonaListReturn) {
				hasMoreThanOneResult.value = true;
				Array.isArray(personaReturn.idPersonaListReturn.idPersona)
					? (listPerson.value = personaReturn.idPersonaListReturn.idPersona)
					: listPerson.value.push(personaReturn.idPersonaListReturn.idPersona);

				return;
			}

			if ('errorConstancia' in personaReturn.personaReturn) {
				message.error({
					content: () => personaReturn.personaReturn.errorConstancia?.error,
					duration: 6,
					style: {
						color: 'red',
						fontSize: 'large',
					},
				});

				if (
					personaReturn.personaReturn.errorConstancia?.error !=
					'La CUIT que ingresaste se encuentra inactiva, ingresá tu CUIT activa'
				) {
					sujeto.value.name = personaReturn.personaReturn.errorConstancia!.nombre;
					sujeto.value.lastName = personaReturn.personaReturn.errorConstancia!.apellido;
					sujeto.value.inscription = CONSUMIDOR_FINAL;
					sujeto.value.cuit_id = 86;
					sujeto.value.afip_data = personaReturn.personaReturn;
					sujeto.value.cuit = personaReturn.personaReturn.errorConstancia!.idPersona;
				}

				return;
			}

			if (personaReturn.personaReturn.datosGenerales.tipoPersona === 'FISICA') {
				sujeto.value.name = personaReturn.personaReturn.datosGenerales.nombre;
				sujeto.value.type_company = TypeCompany.FISICA;
				sujeto.value.lastName = personaReturn.personaReturn.datosGenerales.apellido;
				if ('datosMonotributo' in personaReturn.personaReturn) {
					sujeto.value.inscription = MONOTRIBUTO;
				} else if ('datosRegimenGeneral' in personaReturn.personaReturn) {
					setAfipInscriptionType(personaReturn.personaReturn);
				}
			}

			if (personaReturn.personaReturn.datosGenerales.tipoPersona === 'JURIDICA') {
				//lastNameIsRequired.value = false;
				sujeto.value.type_company = TypeCompany.JURIDICA;
				sujeto.value.name = personaReturn.personaReturn.datosGenerales.razonSocial;

				if ('datosRegimenGeneral' in personaReturn.personaReturn) {
					setAfipInscriptionType(personaReturn.personaReturn);
				}
			}

			sujeto.value.cuit = personaReturn.personaReturn.datosGenerales.idPersona;
			sujeto.value.cuit_id = 80;
			sujeto.value.afip_data = personaReturn.personaReturn;
			setAfipAddress(personaReturn.personaReturn.datosGenerales.domicilioFiscal);
		}
	});
};

const rules = ref({
	cuit: [
		{
			validator: validateCuit,
			trigger: 'blur',
		},
	],
});
</script>
<template>
	<a-form
		class="flex-container"
		name="ninjadash_validation-form"
		ref="afipGetPersonForm"
		:model="sujeto"
		:rules="rules"
		layout="vertical"
	>
		<a-form-item name="cuit" ref="cuit" label="CUIT" has-feedback class="space--cuit--button">
			<a-input
				:disabled="sujetoIsEditable"
				v-model:value="sujeto.cuit"
				autocomplete="off"
				@change="(e:any) => e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
				v-if="!hasMoreThanOneResult"
			/>
			<a-select v-else ref="select" v-model:value="sujeto.cuit" style="width: 213px" open>
				<a-select-option v-for="number in listPerson" :value="number" :key="number">{{
					number
				}}</a-select-option>
			</a-select>
		</a-form-item>
		<a-form-item>
			<a-tooltip placement="right" color="lightgrey">
				<template #title>
					<span>Buscar datos del CUIT</span>
				</template>
				<a-button
					type="primary"
					shape="round"
					size="large"
					@click.prevent="getInfo"
					style="margin-top: 2rem"
					:loading="search"
					:disabled="sujetoIsEditable"
				>
					<template #icon>
						<SearchOutlined />
					</template>
					<span>Buscar</span>
				</a-button>
			</a-tooltip>
		</a-form-item>
	</a-form>
</template>
<style scoped>
.flex-container {
	display: flex;
	justify-content: start;
}
.space--cuit--button {
	margin-right: 2rem;
}
</style>
