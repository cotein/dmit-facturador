import type { AfipInscription } from '@/app/types/Afip';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAfipInscriptionsStore = defineStore('afip-inscriptions', () => {
    const inscriptions = ref<AfipInscription[]>([]);

    //Actions
    const setInscriptionsAction = (value: AfipInscription[]) => {
        inscriptions.value = value;
    };
    return {
        //State properties
        //Actions
        setInscriptionsAction,
        //Getters
        InscriptionsGetter: computed(() => inscriptions.value),
    };
});
