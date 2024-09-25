import { useArbaStore } from '@/app/store/arba/useArbaStore';
import { storeToRefs } from 'pinia';
import { apiArbaAlicuotaPorSujeto } from '@/api/arba/arba-alicuota-por-sujeto';

const { alicuotaPercepcion, simpleXMLElementArba } = storeToRefs(useArbaStore());
const { alicuotaPercepcionInitilize } = useArbaStore();

export const useArbaComposable = () => {
    const alicuotaPorSujeto = async (cuit: number) => {
        const resp = await apiArbaAlicuotaPorSujeto(cuit);
        return resp;
    };

    return {
        alicuotaPercepcion,
        simpleXMLElementArba,
        alicuotaPorSujeto,
        alicuotaPercepcionInitilize,
    };
};
