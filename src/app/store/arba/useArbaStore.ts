import type { SimpleXMLElementArba } from './../../types/Arba';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useArbaStore = defineStore('arba', () => {
    const simpleXMLElementArba = ref<SimpleXMLElementArba>(); //se utiliza para los componentes cascader

    const alicuotaPercepcion = ref<number>(0);

    const alicuotaPercepcionInitilize = () => {
        alicuotaPercepcion.value = 0;
        simpleXMLElementArba.value = undefined;
    };

    return {
        simpleXMLElementArba,
        alicuotaPercepcion,
        alicuotaPercepcionInitilize,
    };
});
