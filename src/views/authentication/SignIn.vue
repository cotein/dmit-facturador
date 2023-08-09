<script lang="ts" setup>
import { reactive, onMounted, ref } from 'vue';
import { AuthWrapper } from './style';
import { Login } from '@/api/auth/login-api';
import type { LoginDataOAuthToken } from '@/types/OauthToken';
import { message, notification } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user/user-store';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';

const router = useRouter();
const loginData = reactive<LoginDataOAuthToken>({
	grant_type: import.meta.env.VITE_GRANT_TYPE!,
	client_id: import.meta.env.VITE_CLIENT_ID!,
	client_secret: import.meta.env.VITE_CLIENT_SECRET!,
	username: '',
	password: '',
	scope: '',
});

const isLoading = ref<boolean>(false);

const cleanData = () => {
	loginData.username = '';
	loginData.password = '';
	isLoading.value = false;
};

const { UserGetter, setUser, setLogin } = useUserStore();

const login = async () => {
	isLoading.value = true;

	const { data } = await Login(loginData)
		.catch((e) => {
			console.log('🚀 ~ file: SignIn.vue:28 ~ login ~ e:', e);
			/* notification['error']({
				message: 'Inicio de sesión',
				description: 'e.response.data.message',
				placement: 'topLeft',
				duration: 5,
			}); */
			notification['success']({
				message: 'Notification Title',
				description:
					'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
			});
			message.error({
				content: () => 'Vuelva a intentarlo, si el error persiste comuníquese con el soporte técnico.',
				duration: 4,
				style: {
					color: 'red',
					fontSize: 'large',
				},
			});
		})
		.finally(() => cleanData());

	if (data) {
		console.log('🚀 ~ file: SignIn.vue:46 ~ login ~ data:', data);
		setUser(data);
		setLogin();
		/* notification['success']({
			message: 'Usuario Loggeado',
			description: `Bienvenido`,
		}); */

		router.push({ name: 'company' });
	}
};
</script>

<template>
	<a-row justify="center" style="background-color: #f8f9fb">
		<a-col :xxl="6" :xl="12" :md="12" :sm="18">
			<AuthWrapper>
				<div class="ninjadash-authentication-top">
					<h2 class="ninjadash-authentication-top__title">Inicio de Sesión</h2>
				</div>
				<div class="ninjadash-authentication-content">
					<a-form @finish="login" layout="vertical" :model="loginData">
						<a-form-item
							name="username"
							label="Ingresar E-mail"
							:rules="[{ required: true, message: 'El campo e-mail es requerido!' }]"
						>
							<a-input type="email" v-model:value="loginData.username" />
						</a-form-item>

						<a-form-item
							name="password"
							initialValue="123456"
							label="Contraseña"
							:rules="[{ required: true, message: 'La contraseña es requerida!' }]"
						>
							<a-input type="password" v-model:value="loginData.password" placeholder="Password" />
						</a-form-item>
						<!-- <div class="ninjadash-auth-extra-links">
						<a-checkbox @change="onChange">Keep me logged in</a-checkbox>
						<router-link class="forgot-pass-link" to="/auth/forgotPassword"> Forgot password? </router-link>
					</div> -->
						<a-form-item>
							<!-- <sdButton class="btn-signin" htmlType="submit" type="primary">
								{{ isLoading ? 'Ingresando...' : 'Ingresar' }}
							</sdButton> -->
							<a-button
								type="primary"
								size="large"
								html-type="submit"
								:loading="isLoading"
								style="width: 100%"
							>
								<template #icon>
									<SearchOutlined />
								</template>
								<span>Ingresar</span>
							</a-button>
						</a-form-item>
						<!-- <p class="ninjadash-form-divider">
							<span>Ó</span>
						</p>
						<ul class="ninjadash-social-login">
							<li>
								<a class="google-social" href="#">
									<img src="/src/assets/img/icon/google-plus.svg" class="svg" alt="" />
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
						<div class="auth0-login">
							<!-- <a href="#" @click="() => lock.show()"> Sign In with Auth0 </a> -->
						</div>
					</a-form>
				</div>
				<div class="ninjadash-authentication-bottom">
					<p>¿No tienes una cuenta?<router-link to="/auth/register">Registrarse</router-link></p>
				</div>
			</AuthWrapper>
		</a-col>
	</a-row>
</template>
