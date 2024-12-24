import { storeToRefs } from 'pinia';
import { useEmailStore } from '@/app/store/email/useEmailStore';

const { toggleDrawerEmail } = useEmailStore();
const { openDrawerEmail, formSenderEmailData, invoiceToBeConvertedToPdf } = storeToRefs(useEmailStore());

export const useEmailComposable = () => {
    return {
        openDrawerEmail,
        toggleDrawerEmail,
        formSenderEmailData,
        invoiceToBeConvertedToPdf,
    };
};
