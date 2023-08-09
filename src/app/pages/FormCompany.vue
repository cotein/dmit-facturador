<script setup lang="ts">
import type { UnwrapRef } from 'vue';
import type { Impuesto } from '@/types/Afip';
import type { DomicilioFiscal, PersonaReturn } from '@/types/Afip';

import { FormValidationWrap, VerticalFormStyleWrap } from './../../views/forms/overview/Style';
import { Main } from './../../views/styled';
import { reactive, ref } from 'vue';
import { useInscriptionsComposable } from '@/composables/afip/useInscriptionsComposable';
import locale from 'ant-design-vue/es/date-picker/locale/es_ES';
import { DatePickerWrapper } from './../../views/styled';
import { apiAfipGetCompanyDataByCuit } from '@/api/afip/afip-padron';
import { SearchOutlined } from '@ant-design/icons-vue';
import AddressForm from '../components/address/AddressForm.vue';
import { useAddressStore } from '@/store/address/address-store';
import { message, notification } from 'ant-design-vue';
import { saveCompany } from '@/api/company/company-api';
import { TypeCompany, type CompanyRawData } from '@/types/Company';

/**PROPERTIES */
const companyForm: UnwrapRef<CompanyRawData> = reactive({
	layout: 'vertical',
	name: '',
	lastName: '',
	cuit: '',
	inscription: '',
	number: '',
	activity_init: '',
	iibb: '',
	afip_environment: 'testing',
	type_company: null,
	perception_iibb: false,
	perception_iva: false,
	pto_vta_fe: 0,
	pto_vta_remito: 0,
	pto_vta_recibo: 0,
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

const loading = ref<boolean>(false);

const lastNameIsRequired = ref<boolean>(true);

const companyFormRef = ref();

const RESPONSABLE_INSCRIPTO = 1;

const MONOTRIBUTO = 6;

const EXENTO = 4;

const rules = reactive({
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
			required: lastNameIsRequired,
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
			validator: (_: any, value: any) => {
				const number = Number(value);
				if (Number.isNaN(number)) {
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
				if (addressStore.isValid) {
					return Promise.resolve();
				}
				return Promise.reject();
			},
		},
	],
	pto_vta_fe: [
		{
			required: true,
			message: 'El punto de venta de Factura Electrónica es requerido',
			trigger: 'blur',
		},
		/* {
			number: true,
			message: 'El punto de venta de Factura Electrónica debe ser numérico',
			validator: (value: any) => {
				const pp = new RegExp('/d');
				console.log('🚀 ~ file: FormCompany.vue:174 ~ regexp:', pp.test(value));
			},
		}, */
	],
	pto_vta_remito: [
		{
			required: true,
			message: 'El punto de venta del remito es requerido',
			trigger: 'blur',
		},
	],
	pto_vta_recibo: [
		{
			required: true,
			message: 'El punto de venta del recibo es requerido',
			trigger: 'blur',
		},
	],
});

/**COMPOSABLES */
const { isLoading: inscriptionLoading, store } = useInscriptionsComposable();

const addressStore = useAddressStore();

/**STORES */
const { StatesGetter } = useAddressStore();

/**METHODS */
const onSubmit = async () => {
	if (!lastNameIsRequired.value) {
		delete rules.lastName;
	}

	const validate = await companyFormRef.value.validate().catch((error: any) => {
		console.log('error', error);
	});

	if (validate) {
		companyForm.address = addressStore.address;
		const company = await saveCompany(companyForm)
			.catch((err) => {
				console.log('🚀 ~ file: FormCompany.vue:216 ~ onSubmit ~ err:', err);
			})
			.finally(() => console.log('finally'));

		if (company) {
			console.log('🚀 ~ file: FormCompany.vue:221 ~ onSubmit ~ company:', company);
			notification['success']({
				message: 'EMPRESA',
				description: 'Datos guardados correctamente',
			});
		}
	}
};

const resetForm = () => {
	companyFormRef.value.resetFields();
};

const setAfipInscriptionType = (personaReturn: any) => {
	personaReturn.datosRegimenGeneral.impuesto.map((impuesto: Impuesto) => {
		if (impuesto.descripcionImpuesto === 'IVA') {
			companyForm.inscription = RESPONSABLE_INSCRIPTO;
		}
		if (impuesto.descripcionImpuesto === 'IVA EXENTO') {
			companyForm.inscription = EXENTO;
		}
	});
};
const getInfoByCUIT = async () => {
	/**TODO REUTILIZAR ESTE FUNCION */
	await companyFormRef.value
		.validateFields(['cuit'])
		.then(() => {
			loading.value = true;

			setTimeout(async () => {
				const { personaReturn } = (await apiAfipGetCompanyDataByCuit(companyForm.cuit)
					.catch((err) => {
						console.log('🚀 ~ file: FormCompany.vue:208 ~ setTimeout ~ err:', err);

						message.error({
							content: () =>
								'Error al buscar información sobre la CUIT ingresada, si el error persiste comuníquese con el soporte técnico.',
							duration: 4,
							style: {
								color: 'red',
								fontSize: 'large',
							},
						});
					})
					.finally(() => (loading.value = false))) as PersonaReturn;

				if (personaReturn) {
					console.log('🚀 ~ file: FormCompany.vue:178 ~ setTimeout ~ personaReturn:', personaReturn);

					if ('errorConstancia' in personaReturn) {
						console.log(
							"🚀 ~ file: FormCompany.vue:242 ~ setTimeout ~ 'errorConstancia':",
							'errorConstancia',
						);
						message.error({
							content: () => personaReturn.errorConstancia?.error,
							duration: 6,
							style: {
								color: 'red',
								fontSize: 'large',
							},
						});

						return;
					}

					companyForm.afip_data = personaReturn;

					const domicilio: DomicilioFiscal = personaReturn.datosGenerales.domicilioFiscal;

					addressStore.address.state_id = domicilio.idProvincia + 1;
					addressStore.address.city = domicilio.localidad;
					addressStore.address.street = domicilio.direccion;
					addressStore.address.cp = domicilio.codPostal;
					addressStore.isValid = true;

					if (personaReturn.datosGenerales.tipoPersona === 'FISICA') {
						companyForm.name = personaReturn.datosGenerales.nombre;
						companyForm.type_company = TypeCompany.FISICA;
						companyForm.lastName = personaReturn.datosGenerales.apellido;

						if ('datosMonotributo' in personaReturn) {
							companyForm.inscription = MONOTRIBUTO;
						} else if ('datosRegimenGeneral' in personaReturn) {
							setAfipInscriptionType(personaReturn);
						}
					}

					if (personaReturn.datosGenerales.tipoPersona === 'JURIDICA') {
						lastNameIsRequired.value = false;
						companyForm.type_company = TypeCompany.JURIDICA;
						companyForm.name = personaReturn.datosGenerales.razonSocial;

						if ('datosRegimenGeneral' in personaReturn) {
							setAfipInscriptionType(personaReturn);
						}
					}
				}
			}, 100);
		})
		.catch(() => {});
};
</script>

<template>
	<div>
		<sdPageHeader title="Compañía" class="ninjadash-page-header-main"> </sdPageHeader>

		<Main>
			<AlertList>
				<div class="alert-empty-message">
					<a-alert
						closeText="Cerrar"
						:outlined="false"
						:closable="true"
						:showIcon="true"
						message="Nota importante"
						description="Se ha detectado que Ud. no tiene una compañía asignada a su perfil, complete los datos del formulario, delegue el servicio de facturación eletrónica a nuestro nombre y comience a emitir comprobantes de ventas electrónicos con los servicios web de AFIP."
						type="info"
					/>
				</div>
			</AlertList>
			<a-row :gutter="25">
				<a-col :xs="24">
					<sdCards title="Datos" caption="The simplest use of Form">
						<FormValidationWrap>
							<VerticalFormStyleWrap>
								<a-form
									name="ninjadash_validation-form"
									ref="companyFormRef"
									:model="companyForm"
									:rules="rules"
									:layout="companyForm.layout"
								>
									<a-row :gutter="30">
										<a-col :md="5" :xs="24">
											<a-form-item ref="cuit" name="cuit" label="CUIT" has-feedback>
												<a-input
													v-model:value="companyForm.cuit"
													autocomplete="off"
													@change="(e:any) => e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
												/>
											</a-form-item>
										</a-col>
										<a-col :md="3" :xs="24">
											<a-form-item>
												<a-tooltip placement="right" color="lightgrey">
													<template #title>
														<span>Buscar datos del CUIT</span>
													</template>
													<a-button
														type="primary"
														shape="round"
														size="large"
														@click.prevent="getInfoByCUIT"
														:loading="loading"
														style="margin-top: 2rem"
													>
														<template #icon>
															<SearchOutlined />
														</template>
														<span>{{ loading ? 'Buscando...' : 'Buscar' }}</span>
													</a-button>
												</a-tooltip>
											</a-form-item>
										</a-col>
										<a-col :md="lastNameIsRequired ? 8 : 16" :xs="24">
											<a-form-item
												ref="name"
												:label="lastNameIsRequired ? 'Nombre' : 'Razón Social'"
												name="name"
											>
												<a-input v-model:value="companyForm.name" placeholder="Nombre" />
											</a-form-item>
										</a-col>
										<a-col :md="8" :xs="24" v-if="lastNameIsRequired">
											<a-form-item ref="lastName" name="lastName" label="Apellido">
												<a-input v-model:value="companyForm.lastName" placeholder="Apellido" />
											</a-form-item>
										</a-col>
										<a-col :md="10" :xs="24">
											<a-form-item
												ref="fantasy_name"
												name="fantasy_name"
												label="Nombre de Fantasía"
											>
												<a-input
													v-model:value="companyForm.fantasy_name"
													placeholder="Nombre de Fantasía"
												/>
											</a-form-item>
										</a-col>
										<a-col :md="8" :xs="24">
											<a-form-item
												ref="inscription"
												name="inscription"
												label="Inscripción en AFIP"
											>
												<a-select
													v-model:value="companyForm.inscription"
													size="large"
													show-search
													placeholder="Inscripción en Afip"
													:default-active-first-option="false"
													:show-arrow="false"
													:filter-option="false"
													allowClear
													:not-found-content="null"
													:options="store.InscriptionsGetter"
													:loading="inscriptionLoading"
												>
													<!-- <a-select-option
													v-for="(item, index) in store.InscriptionsGetter"
													:key="index"
													:value="item.id"
													>{{ item.name }}</a-select-option
												> -->
												</a-select>
											</a-form-item>
										</a-col>
										<a-col :md="6" :xs="24">
											<a-form-item
												ref="activity_init"
												label="Inicio de actividades"
												name="activity_init"
											>
												<DatePickerWrapper>
													<a-date-picker
														v-model:value="companyForm.activity_init"
														size="large"
														placeholder="Seleccionar Fecha"
														:format="'DD-MM-YYYY'"
														:locale="locale"
													/>
												</DatePickerWrapper>
											</a-form-item>
										</a-col>
										<a-col :md="6" :xs="24">
											<a-form-item ref="iibb" name="iibb" label="N° de Ingresos Brutos">
												<a-input v-model:value="companyForm.iibb" placeholder="IIBB" />
											</a-form-item>
										</a-col>
										<a-col :md="4" :xs="24">
											<a-form-item ref="type_company" name="type_company" label="Tipo de Empresa">
												<a-select
													v-model:value="companyForm.type_company"
													size="large"
													placeholder="Tipo"
													:default-active-first-option="false"
													:show-arrow="false"
													:filter-option="false"
													allowClear
													:not-found-content="null"
												>
													<a-select-option :value="TypeCompany.JURIDICA"
														>JURÍDICA</a-select-option
													>
													<a-select-option :value="TypeCompany.FISICA"
														>FÍSICA</a-select-option
													>
												</a-select>
											</a-form-item>
										</a-col>
									</a-row>
									<a-divider class="divider" />
									<a-typography-title :level="4">Entorno de Facturación</a-typography-title>
									<a-radio-group v-model:value="companyForm.afip_environment" button-style="solid">
										<a-radio-button value="production">Producción</a-radio-button>
										<a-radio-button value="testing">Testing</a-radio-button>
									</a-radio-group>
									<!-- <div class="ninjadash_agree-check">
										<a-form-item>
											<a-checkbox name="checkbox"> Agree to terms and conditions </a-checkbox>
										</a-form-item>
									</div> -->
									<a-divider class="divider" />
									<a-typography-title :level="4">Domicilio</a-typography-title>
									<a-row :gutter="30">
										<a-col :md="4" :xs="24">
											<a-form-item
												ref="address"
												name="address"
												label="Domicilio"
												:extra="
													!addressStore.isValid
														? 'Es necesario definir un domicilio'
														: 'Cambiar domicilio'
												"
											>
												<a-badge :dot="!addressStore.isValid ? true : false">
													<AddressForm
														:title="
															addressStore.isValid
																? 'Actualizar domicilio'
																: 'Agregar domicilio'
														"
													/>
												</a-badge>
											</a-form-item>
										</a-col>
									</a-row>

									<a-divider class="divider" />
									<a-typography-title :level="4">Percepciones</a-typography-title>

									<a-row :gutter="25" justify="center">
										<a-col :md="12" :xs="24">
											Realiza perceción de Ingresos Brutos
											<a-switch v-model:checked="companyForm.perception_iibb" />
										</a-col>
										<a-col :md="12" :xs="24">
											Realiza perceción de IVA
											<a-switch v-model:checked="companyForm.perception_iva" />
										</a-col>
									</a-row>
									<a-divider class="divider" />
									<a-typography-title :level="4">Configurar puntos de venta</a-typography-title>

									<a-row :gutter="25" justify="center">
										<a-col :md="4" :xs="24">
											<a-form-item ref="pto_vta_fe" name="pto_vta_fe" label="Factura electrónica">
												<a-input v-model:value="companyForm.pto_vta_fe" />
											</a-form-item>
										</a-col>
										<a-col :md="4" :xs="24">
											<a-form-item ref="pto_vta_remito" name="pto_vta_remito" label="Remito">
												<a-input v-model:value="companyForm.pto_vta_remito" />
											</a-form-item>
										</a-col>
										<a-col :md="4" :xs="24">
											<a-form-item ref="pto_vta_recibo" name="pto_vta_recibo" label="Recibo">
												<a-input v-model:value="companyForm.pto_vta_recibo" />
											</a-form-item>
										</a-col>
									</a-row>
									<div class="ninjadash_form-action mt-20">
										<sdButton type="primary" @click.prevent="onSubmit" class="ant-btn-primary">
											Guardar
										</sdButton>
										<sdButton
											@click="resetForm"
											class="btn-outlined"
											size="default"
											:outlined="true"
											type="light"
										>
											Limpiar datos
										</sdButton>
									</div>
								</a-form>
							</VerticalFormStyleWrap>
						</FormValidationWrap>
					</sdCards>
				</a-col>
			</a-row>
		</Main>
	</div>
</template>
<style>
.ant-picker-input input {
	height: 46px;
	text-align: center;
}

.alert-empty-message {
	margin-bottom: 3rem;
}
.divider {
	margin-top: 3rem;
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
