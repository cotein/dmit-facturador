<script setup lang="ts">
import { FormValidationWrap, VerticalFormStyleWrap } from '@/views/forms/overview/Style';
import { Main, DatePickerWrapper } from '@/views/styled';
import { ref, watch, defineEmits, onMounted } from 'vue';
import locale from 'ant-design-vue/es/date-picker/locale/es_ES';
import AddressForm from '../address/AddressForm.vue';
import { TypeCompany } from '@/app/types/Constantes';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';
import GetInfoByCuit from '../afip/GetInfoByCuit.vue';
import { usePadronAfipStore } from '@/app/store/afip/usePadronAfipStore';
import { useUserComposable } from '@/app/composables/user/useUserComposable';
import { useAddressComposable } from '@/app/composables/address/useAddressComposable';
import { useInscriptionsComposable } from '@/app/composables/afip/useInscriptionsComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import type { PersonaReturn } from '@/app/types/Afip';
import { AFIP_INSCRIPTION } from '@/app/types/Constantes';
import { useAddressStore } from '@/app/store/address/address-store';
import { storeToRefs } from 'pinia';
import { showMessage } from '@/app/helpers/mesaages';

const { sujeto } = storeToRefs(usePadronAfipStore());
const { lastNameIsRequired, rules, companyForm, CompanyGetter } = useCompanyComposable();
const { UserGetter } = useUserComposable();
const { isLoading: inscriptionLoading, store } = useInscriptionsComposable();
const { isValid } = useAddressComposable();
const { addressInStore } = storeToRefs(useAddressStore());

interface Props {
    loadingButton: boolean;
    isSaveButton: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loadingButton: false,
    isSaveButton: true,
});

const companyFormRef = ref();
const emit = defineEmits(['submitCompanyForm']);

/**METHODS */
const onSubmit = async () => {
    if (!lastNameIsRequired.value) {
        delete rules.lastName;
    }
    const validate = await companyFormRef.value.validate().catch((error: any) => {
        console.log('error wwwwwwwwwww', error);
    });

    if (validate) {
        companyForm.value.cuit = sujeto.value.cuit;
        companyForm.value.address = addressInStore.value;
        let inscription: any = companyForm.value.inscription;

        if (!Number.isInteger(inscription)) {
            inscription = CompanyGetter.value?.inscription_id;
        }

        if (CompanyGetter.value != undefined) {
            const data = Object.assign(companyForm.value, {
                id: CompanyGetter.value?.id,
                inscription: inscription,
                cuit: CompanyGetter.value?.cuit,
            });
            emit('submitCompanyForm', data);
        } else {
            emit('submitCompanyForm', companyForm.value);
        }
    }
};

const resetForm = () => {
    companyFormRef.value.resetFields();
};

const getTipoPersona = (personaReturn: PersonaReturn): string => {
    return personaReturn.datosGenerales.tipoPersona;
};

watch(
    () => sujeto.value, //cuanod cambia el valor de sujeto (cuit)
    (newValue) => {
        const afipData = newValue.afip_data as PersonaReturn;
        const CONSUMIDOR_FINAL = 5;
        companyForm.value.name = newValue.name;
        if (newValue.cuit_id !== undefined) {
            companyForm.value.cuit_id = newValue.cuit_id;
        }
        companyForm.value.lastName = newValue.lastName;
        //companyForm.value.inscription = newValue.inscription;
        companyForm.value.afip_data = afipData;
        companyForm.value.type_customer = newValue.type_company;

        if (newValue.type_company === 1) {
            lastNameIsRequired.value = false;
        }

        if (newValue.type_company === 2) {
            lastNameIsRequired.value = true;
        }

        if (afipData && afipData.datosGenerales && getTipoPersona(afipData) === 'FISICA') {
            companyForm.value.type_company = TypeCompany.FISICA;
        } else {
            companyForm.value.type_company = TypeCompany.JURIDICA;
        }

        if (afipData && afipData.datosMonotributo) {
            companyForm.value.inscription = AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO;
        }
        if (newValue.inscription === CONSUMIDOR_FINAL) {
            resetForm();
            showMessage('warning', 'La CUIT que ingresaste se encuentra inactiva, ingresá tu CUIT activa', 5);
        }
    },
    { deep: true },
);
const isMobile = ref<boolean>(false);

onMounted(() => {
    if (window.innerWidth <= 768) {
        isMobile.value = true;
    }
});
</script>

<template>
    <Main>
        <AlertList v-if="!UserGetter.value.companies">
            <div class="alert-empty-message" v-if="!isMobile">
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
                <sdCards title="Datos" caption="Datos de la compañía">
                    <FormValidationWrap>
                        <VerticalFormStyleWrap>
                            <a-form
                                name="ninjadash_validation-form"
                                ref="companyFormRef"
                                :model="companyForm"
                                :rules="rules"
                                layout="vertical"
                            >
                                <a-row :gutter="30">
                                    <a-col :md="8" :xs="24" :sm="24">
                                        <GetInfoByCuit :only-cuit="true" />
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
                                    <a-col :md="8" :xs="24" :sm="24" v-if="lastNameIsRequired">
                                        <a-form-item ref="lastName" name="lastName" label="Apellido">
                                            <a-input v-model:value="companyForm.lastName" placeholder="Apellido" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :md="10" :xs="24">
                                        <a-form-item ref="fantasy_name" name="fantasy_name" label="Nombre de Fantasía">
                                            <a-input
                                                v-model:value="companyForm.fantasy_name"
                                                placeholder="Nombre de Fantasía"
                                            />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :md="8" :xs="24" :sm="24">
                                        <a-form-item ref="inscription" name="inscription" label="Inscripción en AFIP">
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
                                    <a-col :md="6" :xs="24" :sm="24">
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
                                    <a-col :md="6" :xs="24" :sm="24">
                                        <a-form-item ref="iibb" name="iibb" label="N° de Ingresos Brutos">
                                            <a-input v-model:value="companyForm.iibb" placeholder="IIBB" />
                                        </a-form-item>
                                    </a-col>
                                    <a-col :md="4" :xs="24" :sm="24">
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
                                                <a-select-option :value="TypeCompany.FISICA">FÍSICA</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :md="12" :xs="24" :sm="24">
                                        <a-form-item
                                            ref="billing_concept"
                                            name="billing_concept"
                                            label="Concepto de facturación"
                                        >
                                            <a-radio-group
                                                v-model:value="companyForm.billing_concept"
                                                class="radio-group"
                                            >
                                                <a-radio-button value="1">PRODUCTOS</a-radio-button>
                                                <a-radio-button value="2">SERVICIOS</a-radio-button>
                                                <a-radio-button value="3">PRODUCTOS Y SERVICIOS</a-radio-button>
                                            </a-radio-group>
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
                                    <a-col :md="4" :xs="24" :sm="24">
                                        <a-form-item
                                            ref="address"
                                            name="address"
                                            label="Domicilio"
                                            :extra="
                                                !isValid ? 'Es necesario definir un domicilio' : 'Cambiar domicilio'
                                            "
                                        >
                                            <a-badge :dot="!isValid ? true : false">
                                                <AddressForm
                                                    :title="isValid ? 'Actualizar domicilio' : 'Agregar domicilio'"
                                                />
                                            </a-badge>
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-divider class="divider" />
                                <a-typography-title :level="4">Percepciones</a-typography-title>

                                <a-row :gutter="25" justify="center">
                                    <a-col :md="12" :xs="24" :sm="24">
                                        <span id="iibb" v-if="isMobile">Percepción de IIBB</span>
                                        <span id="iibb" v-else>Realiza percepción de Ingresos Brutos</span>
                                        <a-switch v-model:checked="companyForm.perception_iibb" />
                                    </a-col>
                                    <a-col :md="12" :xs="24" :sm="24">
                                        <span id="iva" v-if="isMobile">Percepción de Iva</span>
                                        <span id="iva" v-else>Realiza percepción de Iva</span>
                                        <a-switch v-model:checked="companyForm.perception_iva" />
                                    </a-col>
                                </a-row>

                                <div class="ninjadash_form-action mt-20">
                                    <!-- <sdButton type="primary" @click.prevent="onSubmit" class="ant-btn-primary">
										Guardar
									</sdButton> -->
                                    <a-button
                                        type="primary"
                                        size="large"
                                        :loading="props.loadingButton"
                                        @click.prevent="onSubmit"
                                    >
                                        <span>{{ props.isSaveButton ? 'Guardar datos' : 'Actualizar datos' }}</span>
                                    </a-button>
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
@media (max-width: 768) {
    .radio-group {
        flex-direction: column !important;
    }
}
#iibb,
#iva {
    margin-right: 7px;
}
</style>
