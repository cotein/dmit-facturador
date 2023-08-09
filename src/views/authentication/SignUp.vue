<script setup lang="ts">
import { AuthWrapper } from './style';
import { reactive, watch } from 'vue';
import type { RegisterUser } from '@/types/User';
import { useRegister } from '@/composables/register/useRegisterComposable';
import { useRouter } from 'vue-router';
import { notification } from 'ant-design-vue';

const router = useRouter();
/** Properties */
const newUser = reactive<RegisterUser>({
	name: '',
	lastName: '',
	email: '',
	password: '',
	password_confirmation: '',
});

/** Rules */
const password_confirmation = async () => {
	const value = newUser.password_confirmation;
	if (value === '') {
		return Promise.reject('Por favor ingrese la contraseña otra vez');
	} else if (value !== newUser.password) {
		return Promise.reject('Las contraseñas no coinciden');
	} else {
		return Promise.resolve();
	}
};

/** Methods */
const { mutate, isLoading, isSuccess } = useRegister();

watch(isSuccess, () => {
	console.log('🚀 ~ file: SignUp.vue:35 ~ watch ~ isSuccess:', isSuccess.value);
	if (isSuccess.value) {
		const closeWindow = new Promise((resolve) => {
			notification['success']({
				message: 'Registración de Usuario',
				description:
					'Bienvenido a DMIT facturación online, un correo electrónico de verificación ha sido enviado a su casilla. Una vez verificada su cuenta podrá ingresar al Sistema. Gracias. Ahora será dirigido a la página principal.',
				style: {
					width: '600px',
					marginLeft: `${335 - 600}px`,
					color: 'green',
				},
				duration: 5,
			});

			setTimeout(() => {
				resolve(true);
			}, 5200);
		});

		closeWindow.then(() => router.push('/'));
	}
});
</script>
<template>
	<a-row justify="center">
		<a-col :xxl="6" :xl="12" :md="12" :sm="18">
			<AuthWrapper>
				<div class="ninjadash-authentication-top">
					<h2 class="ninjadash-authentication-top__title">Registrarse</h2>
				</div>
				<div class="ninjadash-authentication-content">
					<a-form name="register" :model="newUser" @finish="mutate(newUser)" layout="vertical">
						<a-form-item
							label="Nombre"
							name="name"
							:rules="[{ required: true, message: 'El Nombre es requerido!' }]"
						>
							<a-input v-model:value="newUser.name" placeholder="Full name" />
						</a-form-item>

						<a-form-item
							name="lastName"
							label="Apellido"
							:rules="[{ required: true, message: 'El Apellido es requerido' }]"
						>
							<a-input v-model:value="newUser.lastName" placeholder="Apellido" />
						</a-form-item>
						<a-form-item
							name="email"
							label="Email"
							:rules="[
								{
									required: true,
									message: 'El email es requerido',
									type: 'email',
								},
							]"
						>
							<a-input type="email" v-model:value="newUser.email" placeholder="name@example.com" />
						</a-form-item>
						<a-form-item
							label="Contraseña"
							name="password"
							:rules="[{ required: true, message: 'La contraseña es requerida' }]"
						>
							<a-input-password v-model:value="newUser.password" placeholder="Contraseña" size="large" />
							<!-- <a-input type="password" v-model:value="newUser.password" placeholder="Password" /> -->
						</a-form-item>
						<a-form-item
							label="Confirmación de Contraseña"
							name="password_confirmation"
							:rules="[
								{
									required: true,
									validator: password_confirmation,
								},
							]"
						>
							<a-input-password
								v-model:value="newUser.password_confirmation"
								placeholder="Confirmación de contraseña"
								size="large"
							/>
							<!-- 	<a-input
								type="password_confirmation"
								v-model:value="newUser.password_confirmation"
								placeholder="Password"
							/> -->
						</a-form-item>
						<!-- <div class="ninjadash-auth-extra-links">
							<a-checkbox @change="onChange">
								Creating an account means you’re okay with our Terms of Service and Privacy Policy
							</a-checkbox>
						</div> -->
						<a-form-item>
							<a-spin :spinning="isLoading">
								<sdButton
									class="btn-create"
									htmlType="submit"
									type="primary"
									size="lg"
									:disabled="isLoading"
								>
									{{ isLoading ? 'Procesando datos' : 'Crear Cuenta' }}
								</sdButton>
							</a-spin>
						</a-form-item>
						<!-- <p class="ninjadash-form-divider">
							<span>Or</span>
						</p>
						<ul class="ninjadash-social-login">
							<li>
								<a class="google-social" href="#">
									<img :src="require('/src/assets/img/icon/google-plus.svg')" alt="" class="svg" />
								</a>
							</li>
							<li>
								<a class="facebook-social" href="#">
									<unicon name="facebook-f"></unicon>
								</a>
							</li>
							<li>
								<a class="twitter-social" href="#">
									<unicon name="twitter"></unicon>
								</a>
							</li>
							<li>
								<a class="twitter-social" href="#">
									<unicon name="github"></unicon>
								</a>
							</li>
						</ul> -->
					</a-form>
				</div>
				<div class="ninjadash-authentication-bottom">
					<p>¿Ya posee una cuenta con nosotros?<router-link to="/auth/login">Iniciar sesión</router-link></p>
				</div>
			</AuthWrapper>
		</a-col>
	</a-row>
</template>
<style scoped>
.coto-ubication {
	padding-left: 61px;
	padding-top: 31px;
}
</style>
