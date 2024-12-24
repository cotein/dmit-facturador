import type { EmailAttachment, SenderEmailData } from '@/app/types/Email';
import type { InvoiceList } from '@/app/types/Invoice';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEmailStore = defineStore('email', () => {
    const openDrawerEmail = ref<boolean>(false);

    const formSenderEmailData = ref<SenderEmailData>({
        from: '',
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        html: '',
        text: '',
        scheduled_at: '',
        attachments: [] as EmailAttachment[],
    });

    const invoiceToBeConvertedToPdf = ref<InvoiceList | {}>({});

    const toggleDrawerEmail = () => {
        openDrawerEmail.value = !openDrawerEmail.value;
    };

    return {
        openDrawerEmail,
        toggleDrawerEmail,
        formSenderEmailData,
        invoiceToBeConvertedToPdf,
    };
});
