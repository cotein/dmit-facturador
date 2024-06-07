import type { AfipIva, AfipState } from '@/app/types/Afip';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAfipIvaStore = defineStore('afip-ivas', () => {
    //State properties
    const ivas = ref<AfipIva[]>([]);
    //Actions
    const setIvasAction = (value: AfipIva[]) => (ivas.value = value);
    //Getters
    return {
        //State properties
        //Actions
        setIvasAction,
        //Getters
        IvasGetter: computed(() => ivas.value),
    };
});
