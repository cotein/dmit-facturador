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
                    :disabled="sendVerificationButtonDisabled || buttonClicked"
                    >Re-enviar petición de verificación
                </a-button>
                <!--<a-button
                    type="success"
                    class="btn-create"
                    @click="goToLogin"
                    :disabled="!sendVerificationButtonDisabled"
                    >Iniciar sesión en el Sistema
                </a-button>-->
            </a-space>
        </MaintananceWrapper>
    </div>
</template>

<script setup lang="ts">
import { MaintananceWrapper } from './style';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { apiEmailVerification, apiEmailResendVerification } from './../../api/auth/email-verification-api';
import { useSleepComposable } from '../composables/sleep/useSleepComposable';
import { notification } from 'ant-design-vue';
import { ref } from 'vue';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';

const spinning = ref<boolean>(false);
const sendVerificationSpinner = ref<boolean>(false);
const sendVerificationButtonDisabled = ref<boolean>(true);
const route = useRoute();
const token = route.query.token; // Accede al parámetro token de la ruta
const { sleep } = useSleepComposable();
const buttonClicked = ref<boolean>(false);

const goToLogin = () => {
    window.location.replace('http://localhost:5173/auth/login');
    //window.location.replace(`${import.meta.env.VITE_URL}/auth/login`);
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
    console.log('EmailVerification component mounted ', token);

    if (!token) {
        notification['error']({
            message: 'Verificación de cuenta',
            description: 'No se ha encontrado el token de verificación, por favor comuniquese al soporte técnico.',
            style: {
                width: '600px',
                marginLeft: `${335 - 600}px`,
                color: 'green',
            },
            duration: 5,
        });
        spinning.value = false;
        return;
    }

    try {
        // Hacer una solicitud a la API de Laravel para verificar el token
        const response = await apiEmailVerification(`/verify-email?token=${token}`)
            .catch((err) => {
                notification['error']({
                    message: 'Verificación de cuenta',
                    description: err.response.data.message,
                    style: {
                        width: '600px',
                        marginLeft: `${335 - 600}px`,
                        color: 'green',
                    },
                    duration: 5,
                });
            })
            .finally(() => {
                spinning.value = false;
            });

        if (response) {
            notification['success']({
                message: 'Verificación de cuenta',
                description: response.data.message,
                style: {
                    width: '600px',
                    marginLeft: `${335 - 600}px`,
                    color: 'green',
                },
                duration: 5,
            });

            sendVerificationButtonDisabled.value = false;

            await sleep(1000);

            goToLogin();
        }
    } catch (err) {
        notification['error']({
            message: 'Verificación de cuenta',
            description: 'Ocurrió un error al conectar con el servidor.',
            style: {
                width: '600px',
                marginLeft: `${335 - 600}px`,
                color: 'green',
            },
            duration: 5,
        });
    } finally {
        spinning.value = false;
    }
});
</script>
