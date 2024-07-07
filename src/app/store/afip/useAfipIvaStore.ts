import type { AfipIva, AfipState } from '@/app/types/Afip';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAfipIvaStore = defineStore('afip-ivas', () => {
    //State properties
    const ivas = ref<AfipIva[]>([]);
    const loaded = ref<boolean>(false);
    //Actions
    const setIvasAction = (value: AfipIva[]) => {
        ivas.value = value;
        loaded.value = true;
    };
    //Getters
    return {
        //State properties
        loaded,
        //Actions
        setIvasAction,
        //Getters
        IvasGetter: computed(() => ivas.value),
    };
});
