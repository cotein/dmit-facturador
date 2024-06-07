import { storeToRefs } from 'pinia';
import { useSearchProductStore } from './../../store/product/useSearchProductStore';
const { selectedProduct, priceList, sendProductToInvoice } = storeToRefs(useSearchProductStore());

export const useSearchProductComposable = () => {
    return {
        selectedProduct,
        priceList,
        sendProductToInvoice,
    };
};
