<template>
    <div>
        <MaintananceWrapper>
            <img :src="$environment.VITE_SRC_ASSETS + `/img/email/verify-email.svg`" alt="verify-email" />
            <a-spin size="large" :spinning="spinning" />
            <br />
            <sdHeading as="h3">Espere unos instantes, estamos verificando su correo electrónico.</sdHeading>
            <p>
                Si la respuesta es fallida, reenvíe una nueva petición. <br />
                Equipo de DMIT.
            </p>
            <!-- <sdButton
				class="btn-create"
				htmlType="submit"
				type="secondary"
				size="lg"
				:loading="true"
				v-if="!sendVerification"

			>
				Re-enviar petición de verificación
			</sdButton> -->
            <a-space>
                <a-button
                    type="primary"
                    class="btn-create"
                    @click="resend"
                    :loading="sendVerificationSpinner"
                    :disabled="sendVerificationButtonDisabled"
                    >Re-enviar petición de verificación
                </a-button>
                <a-button
                    type="success"
                    class="btn-create"
                    @click="goToLogin"
                    :disabled="!sendVerificationButtonDisabled"
                    >Iniciar sesión en el Sistema
                </a-button>
            </a-space>
        </MaintananceWrapper>
    </div>
</template>

<script setup lang="ts">
import { MaintananceWrapper } from './style';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { apiEmailVerification, apiEmailResendVerification } from './../../api/auth/email-verification-api';
import { notification } from 'ant-design-vue';
import { ref } from 'vue';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';
import { showMessage } from '../helpers/mesaages';
import type { AxiosError } from 'axios';

const router = useRouter();
const spinning = ref<boolean>(false);
const sendVerificationSpinner = ref<boolean>(false);
const sendVerificationButtonDisabled = ref<boolean>(true);
const route = useRoute();
const id = route.params.id;
const hash = route.params.hash;
const signature = route.query.signature;

const goToLogin = () => {
    //window.location.replace('http://localhost:5173/auth/login');
    window.location.replace(`${import.meta.env.VITE_URL}/auth/login`);
};
const resend = async () => {
    sendVerificationSpinner.value = true;

    const { data } = await apiEmailResendVerification(id)
        .catch((err) => {
            notification['error']({
                message: 'Verificación de cuenta',
                description: 'Ha ocurrido un error inesperado, por favor comuniquese al soporte técnico.',
                style: {
                    width: '600px',
                    marginLeft: `${335 - 600}px`,
                    color: 'green',
                },
                duration: 5,
            });
        })
        .finally(() => {
            sendVerificationSpinner.value = false;
            sendVerificationButtonDisabled.value = true;
        });

    if (data) {
        notification['success']({
            message: 'Verificación de cuenta',
            description: data,
            duration: 5,
        });
    }
};
onMounted(async () => {
    spinning.value = true;
    const url = `/email/verify/${id}/${hash}?signature=${signature}`;

    try {
        const response = await apiEmailVerification(url);

        if (response && response.data) {
            showMessage('success', 'Cuenta verificada, inicie sesión en el Sistema', 3);

            router.replace({ name: 'login' });
        }
    } catch (error) {
        if ((error as AxiosError)?.response) {
            // La petición fue hecha y el servidor respondió con un estado de error
            showMessage(
                'error',
                `Ha ocurrido un error inesperado, por favor comuniquese al soporte técnico. ${
                    (error as AxiosError)?.response?.data
                }`,
                5,
            );
            console.log((error as AxiosError).response);
        } else if ((error as AxiosError).request) {
            // La petición fue hecha pero no se recibió ninguna respuesta
            showMessage('error', `La petición fue hecha pero no se recibió ninguna respuesta`, 5);
            console.log((error as AxiosError).request);
        } else {
            // Algo sucedió en la configuración de la petición que provocó un error
            showMessage('error', `Algo sucedió en la configuración de la petición que provocó un error`, 5);
            console.log('Error', (error as AxiosError).message);
        }
        console.log('🚀 ~ onMounted ~ error:', error);
        sendVerificationSpinner.value = false;
    } finally {
        // Este bloque se ejecutará independientemente de si se produjo una excepción o no
        spinning.value = false;
    }
});
</script>
