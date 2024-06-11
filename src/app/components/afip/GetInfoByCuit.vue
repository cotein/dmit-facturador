<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePadronComposable } from '@/app/composables/afip/usePadronComposable';
import { apiAfipGetCompanyDataByCuit } from '@/api/afip/afip-padron';
import { TypeCompany } from '@/app/types/Constantes';
import type { DomicilioFiscal, IdPersonaListReturn, Impuesto, PersonaReturn } from '@/app/types/Afip';
import { useAddressStore } from '@/app/store/address/address-store';
import { onUnmounted } from 'vue';
import { AFIP_INSCRIPTION } from '@/app/types/Constantes';
import { showMessage } from '@/app/helpers/mesaages';
import { onlyNumeric } from '@/app/helpers/onlyNumbers';

const addressStore = useAddressStore();

interface Props {
    onlyCuit: boolean;
}

const hasMoreThanOneResult = ref<boolean>(false);

const listPerson = ref<number[]>([]);
const loading = ref<boolean>(false);
const afipGetPersonForm = ref();

const props = withDefaults(defineProps<Props>(), {
    onlyCuit: false,
});

const { sujeto, sujetoIsEditable, clearSujetoData } = usePadronComposable();

const validateCuit = (rule: any, value: any) => {
    return new Promise((resolve, reject) => {
        const number = Number(value);
        if (Number.isNaN(number)) reject('La CUIT debe poseer sólo números');
        if (props.onlyCuit && String(value).length != 11) reject('La CUIT debe tenes 11 número');
        if (value === '' || value === undefined) reject('La CUIT es requerida');
        resolve(true);
    });
};

/**
 * Sets the AFIP inscription type based on the returned persona data.
 * @param {Object} personaReturn - The returned persona data.
 */
const setAfipInscriptionType = (personaReturn: any) => {
    personaReturn.datosRegimenGeneral.impuesto.map((impuesto: Impuesto) => {
        switch (impuesto.descripcionImpuesto) {
            case 'IVA':
                sujeto.value.inscription = AFIP_INSCRIPTION.IVA_RESPONSABLE_INSCRIPTO;
                break;
            case 'IVA EXENTO':
                sujeto.value.inscription = AFIP_INSCRIPTION.IVA_SUJETO_EXENTO;
                break;
            // puedes agregar más casos aquí si es necesario
        }
    });
};

const setAfipAddress = (address: DomicilioFiscal) => {
    if (addressStore.addressInStore.hasOwnProperty('localidad')) {
        addressStore.addressInStore.city = address.localidad;
    } else {
        addressStore.addressInStore.city = address.descripcionProvincia;
    }

    addressStore.addressInStore.cp = address.codPostal;
    addressStore.addressInStore.state_id = address.idProvincia + 1;
    addressStore.addressInStore.street = address.direccion;
    addressStore.isValid = true;
};

const handleErrors = (err: any) => {
    loading.value = false;

    showMessage('error', err.response.data.message, 6);
};

const handlePersonaReturn = (personaReturn: PersonaReturn) => {
    loading.value = false;

    if ('idPersona' in personaReturn) {
        if (Array.isArray(personaReturn.idPersona)) {
            hasMoreThanOneResult.value = true;
            listPerson.value = Array.isArray(personaReturn.idPersona)
                ? personaReturn.idPersona
                : [personaReturn.idPersona];

            showMessage('info', 'Se encontraron más de un resultado, seleccione uno', 3);
        } else {
            const cuil: number = personaReturn.idPersona as any;
            sujeto.value.cuit = cuil.toString();
            showMessage(
                'info',
                'Se encontró el CUIL del DNI ingresado, presione el botón de búsqueda para obtener los datos.',
                3,
            );
        }

        return;
    }

    if ('errorConstancia' in personaReturn) {
        handlePersonaReturnError(personaReturn);
        return;
    }

    handlePersonaReturnData(personaReturn);
};

const handlePersonaReturnError = (personaReturn: PersonaReturn) => {
    showMessage('error', personaReturn.errorConstancia!.error, 6);

    if (
        personaReturn.errorConstancia?.error != 'La CUIT que ingresaste se encuentra inactiva, ingresá tu CUIT activa'
    ) {
        sujeto.value.name = personaReturn.errorConstancia!.nombre
            ? personaReturn.errorConstancia!.nombre
            : personaReturn.errorConstancia!.apellido;
        sujeto.value.lastName =
            personaReturn.errorConstancia!.nombre && personaReturn.errorConstancia!.apellido
                ? personaReturn.errorConstancia!.apellido
                : '';
        sujeto.value.inscription = AFIP_INSCRIPTION.CONSUMIDOR_FINAL;
        sujeto.value.cuit_id = 86;
        sujeto.value.afip_data = personaReturn;
        sujeto.value.cuit = personaReturn.errorConstancia!.idPersona.toString();
        sujeto.value.type_company = TypeCompany.FISICA;
    }
};

const handlePersonaReturnData = (personaReturn: PersonaReturn) => {
    if (personaReturn.datosGenerales.tipoPersona === 'FISICA') {
        sujeto.value.name = personaReturn.datosGenerales.nombre ?? '';
        sujeto.value.type_company = TypeCompany.FISICA;
        sujeto.value.lastName = personaReturn.datosGenerales.apellido;
        if ('datosMonotributo' in personaReturn) {
            sujeto.value.inscription = AFIP_INSCRIPTION.RESPONSABLE_MONOTRIBUTO;
        } else if ('datosRegimenGeneral' in personaReturn) {
            setAfipInscriptionType(personaReturn);
        }
    }

    if (personaReturn.datosGenerales.tipoPersona === 'JURIDICA') {
        sujeto.value.type_company = TypeCompany.JURIDICA;
        sujeto.value.name = personaReturn.datosGenerales.razonSocial ?? '';

        if ('datosRegimenGeneral' in personaReturn) {
            setAfipInscriptionType(personaReturn);
        }
    }

    sujeto.value.cuit = personaReturn.datosGenerales.idPersona.toString();
    sujeto.value.cuit_id = 80;
    sujeto.value.afip_data = personaReturn;
    setAfipAddress(personaReturn.datosGenerales.domicilioFiscal);
};

/**
 * Fetches information from the AFIP API based on the CUIT.
 * Validates the form, handles loading states, and processes the returned data.
 */
const getInfo = () => {
    afipGetPersonForm.value
        .validate()
        .then(async () => {
            loading.value = true;
            if (hasMoreThanOneResult.value) {
                hasMoreThanOneResult.value = false;
                listPerson.value = [];
            }

            const response = await apiAfipGetCompanyDataByCuit(sujeto.value.cuit).catch(handleErrors);

            if (response) {
                if ('idPersonaListReturn' in response) {
                    const personaReturn = (response as any).idPersonaListReturn as PersonaReturn;
                    handlePersonaReturn(personaReturn);
                } else if ('personaReturn' in response) {
                    const personaReturn = (response as any).personaReturn as PersonaReturn;
                    handlePersonaReturn(personaReturn);
                }
            }
        })
        .catch((error: any) => {
            loading.value = false;
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

onUnmounted(() => {
    clearSujetoData();
});

const buttonSize = computed(() => (window.innerWidth <= 500 ? 'small' : 'large'));
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
        <a-row justify="center" align="middle" :gutter="10">
            <a-col :md="18" :sm="24" :xs="24">
                <a-form-item name="cuit" ref="cuit" label="CUIT" has-feedback class="space--cuit--button">
                    <template #help>
                        <span class="help--message">Sólo se permiten números</span>
                    </template>
                    <a-input
                        :disabled="sujetoIsEditable"
                        v-model:value="sujeto.cuit"
                        autocomplete="off"
                        @keypress="onlyNumeric"
                        @change="(e:any) => e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')"
                        v-if="!hasMoreThanOneResult"
                    />
                    <a-select v-else ref="select" v-model:value="sujeto.cuit" style="width: 213px" open>
                        <a-select-option v-for="number in listPerson" :value="number" :key="number">{{
                            number
                        }}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" :xs="24">
                <a-form-item class="button-parent">
                    <a-tooltip placement="right" color="lightgrey">
                        <template #title>
                            <span>Buscar datos del CUIT</span>
                        </template>
                        <a-button
                            type="primary"
                            shape="round"
                            :size="buttonSize"
                            @click.prevent="getInfo"
                            class="search-button"
                            :loading="loading"
                            :disabled="sujetoIsEditable"
                        >
                            <template #icon>
                                <SearchOutlined />
                            </template>
                            <span>Buscar</span>
                        </a-button>
                    </a-tooltip>
                </a-form-item>
            </a-col>
        </a-row>
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

.help--message {
    color: #808080;
}
.search-button {
    margin-top: 2rem;
}

@media (max-width: 768px) {
    .search-button {
        margin-top: 0.1rem;
    }
    .button-parent {
        display: flex;
        justify-content: center;
    }
}
</style>
