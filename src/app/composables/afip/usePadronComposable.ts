import { apiAfipGetCompanyDataByCuit } from '@/api/afip/afip-padron';
import { useQuery } from '@tanstack/vue-query';
import { usePadronAfipStore } from '@/app/store/afip/usePadronAfipStore';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import type { Impuesto } from '@/app/types/Afip';

const { sujeto, sujetoIsEditable } = storeToRefs(usePadronAfipStore());

const { clearSujetoData } = usePadronAfipStore();

const RESPONSABLE_INSCRIPTO = 1;

const MONOTRIBUTO = 6;

const EXENTO = 4;

const setAfipInscriptionType = (personaReturn: any) => {
    personaReturn.datosRegimenGeneral.impuesto.map((impuesto: Impuesto) => {
        if (impuesto.descripcionImpuesto === 'IVA') {
            return RESPONSABLE_INSCRIPTO;
        }
        if (impuesto.descripcionImpuesto === 'IVA EXENTO') {
            return EXENTO;
        }
    });
};

/* const domicilioFiscal = () => {
	addressStore.address.state_id = domicilio.idProvincia + 1;
	addressStore.address.city = domicilio.localidad;
	addressStore.address.street = domicilio.direccion;
	addressStore.address.cp = domicilio.codPostal;
	addressStore.isValid = true;
};
 */

export const usePadronComposable = () => {
    const getPerson = (cuit: any) => {
        return useQuery(['afip-padron', cuit], () => apiAfipGetCompanyDataByCuit(cuit), {
            onSuccess(resp) {
                console.log('🚀 ~ file: usePadronComposable.ts:12 ~ onSuccess ~ resp:', resp);
            },

            onError(err) {
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
            },
        });
    };

    return { getPerson, sujeto, clearSujetoData, sujetoIsEditable };
};
