import { storeToRefs } from 'pinia';
import { useEmailStore } from '@/app/store/email/useEmailStore';

const { toggleDrawerEmail, updateFormSenderEmailData } = useEmailStore();
const { openDrawerEmail, formSenderEmailData, invoiceToBeConvertedToPdf, formSenderEmailDataComputed } = storeToRefs(
    useEmailStore(),
);

export const useEmailComposable = () => {
    return {
        openDrawerEmail,
        toggleDrawerEmail,
        formSenderEmailData,
        invoiceToBeConvertedToPdf,
        updateFormSenderEmailData,
        formSenderEmailDataComputed,
    };
};
