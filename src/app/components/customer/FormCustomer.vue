<script setup lang="ts">
import { useCustomerComposable } from '@/app/composables/customer/useCustomerComposable';
import { FormValidationWrap, VerticalFormStyleWrap } from './../../../views/forms/overview/Style';
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useInscriptionsComposable } from '@/app/composables/afip/useInscriptionsComposable';
import AddressForm from '../../components/address/AddressForm.vue';
import { useAddressStore } from '@/app/store/address/address-store';
import { notification } from 'ant-design-vue';
import { saveCustomer } from '@/api/customer/customer-api';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';
import type { Sujeto } from '@/app/types/Company';
import { TypeCompany } from '@/app/types/Constantes';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { storeToRefs } from 'pinia';
import GetInfoByCuit from '../afip/GetInfoByCuit.vue';
import { usePadronAfipStore } from '@/app/store/afip/usePadronAfipStore';
import type { Impuesto, PersonaReturn } from '@/app/types/Afip';
import { showMessage } from '@/app/helpers/mesaages';

interface Props {
    shouldUseAddressRule: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    shouldUseAddressRule: false,
});

const { sujeto } = usePadronAfipStore();

const { CompanyGetter } = useCompanyComposable();

const { lastNameIsRequired, rules, customerForm, clearData } = useCustomerComposable();

const loading = ref<boolean>(false);

const customerFormRef = ref();

/**COMPOSABLES */
const { isLoading: inscriptionLoading, store } = useInscriptionsComposable();

const { isValid } = storeToRefs(useAddressStore());

const addressStore = useAddressStore();

/**METHODS */
const onSubmit = async () => {
    if (!lastNameIsRequired.value) {
        delete rules.lastName;
    }
    loading.value = true;

    const validate = await customerFormRef.value
        .validate()
        .catch((error: any) => {
            console.log('error', error);
        })
        .finally(() => {
            loading.value = false;
        });

    if (validate) {
        customerForm.value.address = addressStore.addressInStore;

        if (CompanyGetter.value) {
            customerForm.value.company_id = CompanyGetter.value.id;
        }

        const customer = await saveCustomer(customerForm.value as Sujeto)
            .catch((err) => {
                showMessage('error', err.response.data.message, 4);
            })
            .finally(() => (loading.value = false));

        if (customer) {
            showMessage('success', 'El Cliente se ha registrado correctamente', 4);
            resetForm();
        }
    }
};

const resetForm = () => {
    customerFormRef.value.resetFields();
};

const getTipoPersona = (personaReturn: PersonaReturn): string => {
    return personaReturn.datosGenerales.tipoPersona;
};

watch(
    () => sujeto,
    (newValue) => {
        const afipData = newValue.afip_data as PersonaReturn;
        customerForm.value.name = newValue.name;
        customerForm.value.cuit_id = newValue.cuit_id;
        customerForm.value.lastName = newValue.lastName;
        customerForm.value.inscription = newValue.inscription;
        customerForm.value.afip_data = afipData;
        customerForm.value.type_customer = newValue.type_company;
        if (newValue.type_company === 1) {
            lastNameIsRequired.value = false;
        }

        if (newValue.type_company === 2) {
            lastNameIsRequired.value = true;
        }

        /* if (
		afipData && afipData.datosGenerales &&
		getTipoPersona(afipData) === 'FISICA'
	) {
		customerForm.value.type_customer = TypeCompany.FISICA;
	} else {
		customerForm.value.type_customer = TypeCompany.JURIDICA;
	}
 */
        /* if(afipData && afipData.idPersonaListReturn){
		sujeto.cuit = afipData.idPersonaListReturn.idPersona.toString();
	}else if (afipData && afipData.datosMonotributo) {
		customerForm.value.inscription = AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO;
	}else if (afipData && afipData.datosGenerales){
		const impuestos = afipData.datosRegimenGeneral.impuesto;

		if (Array.isArray(impuestos)) {
			impuestos.forEach((impuesto:Impuesto) => {
				if (impuesto.descripcionImpuesto === 'IVA') {
					customerForm.value.inscription = AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO;
				}
			});
		}

	}else if (afipData && afipData.errorConstancia) {
		customerForm.value.inscription = AFIP_INSCRIPTION.CONSUMIDOR_FINAL;
		customerForm.value.type_customer = TypeCompany.FISICA;
		} */
    },
    { deep: true },
);

onBeforeMount(() => {
    if (props.shouldUseAddressRule) {
        rules.address.push({
            required: true,
            message: 'Debe ingresar un domicilio válido',
            validator: () => {
                if (addressStore.isValid) {
                    return Promise.resolve();
                }
                return Promise.reject();
            },
        });
    }
});
</script>

<template>
    <a-row :gutter="25">
        <a-col :xs="24">
            <sdCards title="Datos" caption="Datos del Cliente">
                <FormValidationWrap>
                    <VerticalFormStyleWrap>
                        <a-form
                            name="ninjadash_validation-form"
                            ref="customerFormRef"
                            :model="customerForm"
                            :rules="rules"
                            layout="vertical"
                        >
                            <a-row :gutter="30">
                                <a-col :md="8" :xs="24">
                                    <GetInfoByCuit />
                                </a-col>
                                <a-col :md="lastNameIsRequired ? 8 : 16" :xs="24">
                                    <a-form-item
                                        ref="name"
                                        :label="lastNameIsRequired ? 'Nombre' : 'Razón Social'"
                                        name="name"
                                    >
                                        <a-input v-model:value="customerForm.name" placeholder="Nombre" />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="8" :xs="24" v-if="lastNameIsRequired">
                                    <a-form-item ref="lastName" name="lastName" label="Apellido">
                                        <a-input v-model:value="customerForm.lastName" placeholder="Apellido" />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="10" :xs="24">
                                    <a-form-item ref="fantasy_name" name="fantasy_name" label="Nombre de Fantasía">
                                        <a-input
                                            v-model:value="customerForm.fantasy_name"
                                            placeholder="Nombre de Fantasía"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :md="8" :xs="24">
                                    <a-form-item ref="inscription" name="inscription" label="Inscripción en AFIP">
                                        <a-select
                                            v-model:value="customerForm.inscription"
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
                                <a-col :md="4" :xs="24">
                                    <a-form-item ref="type_customer" name="type_customer" label="Tipo de Empresa">
                                        <a-select
                                            v-model:value="customerForm.type_customer"
                                            size="large"
                                            placeholder="Tipo"
                                            :default-active-first-option="false"
                                            :show-arrow="false"
                                            :filter-option="false"
                                            allowClear
                                            :not-found-content="null"
                                        >
                                            <a-select-option :value="TypeCompany.JURIDICA">JURÍDICA</a-select-option>
                                            <a-select-option :value="TypeCompany.FISICA">FÍSICA</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-divider class="divider" />
                            <a-typography-title :level="4">Domicilio</a-typography-title>
                            <a-row :gutter="30">
                                <a-col :md="4" :xs="24">
                                    <a-form-item
                                        ref="address"
                                        name="address"
                                        label="Domicilio"
                                        :extra="!isValid ? 'Es necesario definir un domicilio' : 'Cambiar domicilio'"
                                    >
                                        <a-badge :dot="!isValid ? true : false">
                                            <AddressForm
                                                :title="isValid ? 'Actualizar domicilio' : 'Agregar domicilio'"
                                            />
                                        </a-badge>
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <div class="ninjadash_form-action mt-20">
                                <!-- <sdButton type="primary" @click.prevent="onSubmit" class="ant-btn-primary">
									Guardar
								</sdButton> -->
                                <a-button type="primary" size="large" @click.prevent="onSubmit" :loading="loading">
                                    <span>Guardar Cliente</span>
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
