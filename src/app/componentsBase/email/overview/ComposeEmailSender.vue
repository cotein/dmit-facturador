<script setup lang="ts">
import { ref } from 'vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import type { FormInstance } from 'ant-design-vue';
import { useEmailComposable } from '@/app/composables/email/useEmailComposable';
import { sendEmail } from '@/api-email-sender/api-file-sender';
import { showNotification } from '@/app/helpers/notifications';

const { formSenderEmailData, toggleDrawerEmail, formSenderEmailDataComputed } = useEmailComposable();

const loading = ref<boolean>(false);

const rules = ref({
    from: [{ required: true, message: 'Please input the sender email!', trigger: 'blur' }],
    to: [{ required: true, message: 'Please input the recipient email!', trigger: 'blur' }],
    subject: [{ required: true, message: 'Please input the subject!', trigger: 'blur' }],
    html: [{ required: true, message: 'Please input the email content!', trigger: 'blur' }],
});

const formRef = ref<FormInstance | null>(null);

const onSubmit = async () => {
    loading.value = true;

    formRef.value
        ?.validate()
        .then(async () => {
            // Lógica para enviar el correo
            try {
                const url = '/api/email-sender';

                const resp = await sendEmail(
                    url,
                    formSenderEmailData.value.attachments![0].filename,
                    formSenderEmailData.value,
                );
                loading.value = false;
                if (resp) {
                    console.log('🚀 ~ .then ~ resp:', resp);
                    showNotification('success', 'Envío de factura', 'Email enviado correctamente', 3, 'topLeft');
                    toggleDrawerEmail();
                }
            } catch (error) {
                console.error('Error sending email:', error);
            }
        })
        .catch((error) => {
            console.error('Validation failed:', error);
            loading.value = false;
        });
};
</script>

<template>
    <a-form :model="formSenderEmailData" :rules="rules" ref="formRef" layout="vertical">
        <a-form-item label="De" name="from" :rules="[{ required: true, message: 'Please input the sender email!' }]">
            <a-input v-model:value="formSenderEmailData.from" :disabled="loading" />
        </a-form-item>

        <a-form-item label="A" name="to" :rules="[{ required: true, message: 'Please input the recipient email!' }]">
            <a-input v-model:value="formSenderEmailData.to" :disabled="loading" />
        </a-form-item>

        <a-form-item label="CC" name="cc">
            <a-input v-model:value="formSenderEmailData.cc" :disabled="loading" />
        </a-form-item>

        <a-form-item label="CCO" name="bcc">
            <a-input v-model:value="formSenderEmailData.bcc" :disabled="loading" />
        </a-form-item>

        <a-form-item label="Asunto" name="subject" :rules="[{ required: true, message: 'Please input the subject!' }]">
            <a-input v-model:value="formSenderEmailData.subject" :disabled="loading" />
        </a-form-item>

        <a-form-item
            label="Mensaje"
            name="html"
            :rules="[{ required: true, message: 'Please input the email content!' }]"
        >
            <ckeditor :editor="ClassicEditor" v-model="formSenderEmailData.html"></ckeditor>
        </a-form-item>

        <!-- <a-form-item label="Text Content" name="text">
            <a-textarea v-model:value="formSenderEmailData.text" :disabled="loading" />
        </a-form-item> -->

        <!-- <a-form-item label="Asignar fecha de envío" name="scheduled_at">
            <a-input
                v-model:value="formSenderEmailData.scheduled_at"
                :disabled="loading"
            />
        </a-form-item>
 -->
        <a-form-item
            label="Archivos adjuntos"
            name="attachments"
            v-if="
                formSenderEmailDataComputed &&
                formSenderEmailDataComputed.attachments &&
                formSenderEmailDataComputed.attachments.length
            "
        >
            <a
                :href="`data:application/pdf;base64,${formSenderEmailDataComputed.attachments[0]?.content}`"
                :download="formSenderEmailDataComputed.attachments[0]?.filename"
                target="_blank"
            >
                {{ formSenderEmailDataComputed.attachments[0]!.filename }}
            </a>
        </a-form-item>

        <div class="buttons">
            <div class="inside-buttons">
                <a-button size="default" type="primary" @click="onSubmit" raised :loading="loading"> Enviar</a-button>
            </div>
        </div>
    </a-form>
</template>

<style scoped>
/* CSS crítico en línea */
.buttons {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.inside-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}
</style>
