<template>
	<div>
		<MaintananceWrapper>
			<img :src="`/src/assets/img/email/verify-email.svg`" alt="verify-email" />
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
import { MaintananceWrapper } from './../../views/pages/style';
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { apiEmailVerification, apiEmailResendVerification } from './../../api/auth/email-verification-api';
import { notification } from 'ant-design-vue';
import { ref } from 'vue';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';

const router = useRouter();
const spinning = ref<boolean>(false);
const sendVerificationSpinner = ref<boolean>(false);
const sendVerificationButtonDisabled = ref<boolean>(true);
const route = useRoute();

const goToLogin = () => {
	window.location.replace('http://localhost:5173/auth/login');
};
const resend = async () => {
	const id = route.query.email_verify_url
		?.toString()
		.substring(18, route.query.email_verify_url?.toString().indexOf('?'));

	sendVerificationSpinner.value = true;

	const { data } = await apiEmailResendVerification(id)
		.catch((err) => {
			console.log('🚀 ~ file: EmailVerification.vue:60 ~ resend ~ err:', err);
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

	const url = `${route.query.email_verify_url}&hash=${route.query.hash}&signature=${route.query.signature}`;

	const { data } = await apiEmailVerification(url).catch((err) => {
		console.log('🚀 ~ file: EmailVerification.vue:37 ~ onMounted ~ err:', err);
		if (err.response) {
			if (err.response.status === 403) {
				notification['error']({
					message: 'Verificación de cuenta',
					description: 'Token vencido, vuelva a envíar la solicitud de confirmación de cuenta.',
					duration: 6,
				});
				sendVerificationButtonDisabled.value = false;
			}
		}
		spinning.value = false;
	});

	if (data) {
		localStorage.setItem('www', JSON.stringify(data));
		const closeWindow = new Promise((resolve, reject) => {
			notification['success']({
				message: 'Verificación de cuenta',
				description: data,
				duration: 5,
			});

			spinning.value = false;

			if (data === 'Debe reenviar la petición de verificación de cuenta') {
				setTimeout(() => {
					reject();
				}, 5200);
			}
			if (data === 'Cuenta ya verificada, inicie sesión en el Sistema') {
				setTimeout(() => {
					resolve(true);
				}, 5200);
			}
		});

		closeWindow.then(() => router.replace({ name: 'login' })).catch(() => (sendVerificationSpinner.value = false));
	}
});
</script>
