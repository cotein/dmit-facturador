import type { Address } from '@/app/types/Address';
import type { PersonaReturn } from '@/app/types/Afip';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { TypeCompany } from '@/app/types/Constantes';

type SujetoPadronInStore = {
    name: string;
    lastName: string;
    cuit: string;
    cuit_id: number | undefined;
    inscription: number | undefined;
    type_company: number | undefined;
    address: Address | undefined;
    afip_data?: PersonaReturn | undefined;
};

const createInitialSujeto = () => ({
    name: '',
    lastName: '',
    cuit: '',
    cuit_id: undefined,
    inscription: undefined,
    type_company: TypeCompany.UNDEFINED,
    address: {
        state_id: undefined,
        city: '',
        street: '',
        number: '',
        cp: '',
        obs: '',
        between_streets: '',
        addressable_id: '',
        addressable_type: '',
    },
    afip_data: undefined,
});

export const usePadronAfipStore = defineStore('afip-padron', () => {
    const sujeto = ref<SujetoPadronInStore>(createInitialSujeto());

    const sujetoIsEditable = ref<boolean>(false);

    const clearSujetoData = () => {
        sujeto.value = createInitialSujeto();
    };

    return {
        sujeto,
        clearSujetoData,
        sujetoIsEditable,
    };
});
