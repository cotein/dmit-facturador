<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { AuthWrapper } from './style';
import { Login } from '@/api/auth/login-api';
import type { LoginDataOAuthToken } from '@/app/types/OauthToken';
import { message, notification } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/app/store/user/user-store';
import { getMyData } from '@/api/user/user-api';
import 'ant-design-vue/lib/message/style/index.css';
import 'ant-design-vue/lib/notification/style/index.css';
import type { LoggedUser } from '@/app/types/User';
import { showMessage } from '@/app/helpers/mesaages';

const router = useRouter();
const loginData = reactive<LoginDataOAuthToken>({
    grant_type: import.meta.env.VITE_GRANT_TYPE!,
    client_id: import.meta.env.VITE_CLIENT_ID!,
    client_secret: import.meta.env.VITE_CLIENT_SECRET!,
    username: '',
    password: '',
    scope: '',
});

const msg = 'Ingresar';
const textButton = ref<string>(msg);

const isLoading = ref<boolean>(false);

const cleanData = () => {
    loginData.username = '';
    loginData.password = '';
    isLoading.value = false;
};

const { setUser, setLogin, setUserToken, setAvatar } = useUserStore();

const login = async () => {
    isLoading.value = true;

    textButton.value = 'Validando credenciales';

    const { data } = await Login(loginData).catch((e) => {
        cleanData();
        message.error({
            content: () =>
                e.response.data.message +
                ' Vuelva a intentarlo, si el error persiste comuníquese con el soporte técnico.',
            duration: 4,
            style: {
                color: 'red',
                fontSize: 'large',
            },
        });
    });

    if (data) {
        setUserToken(data);

        textButton.value = 'Buscando datos del usuario';

        const me = await getMyData()
            .catch((e) => {
                message.error({
                    content: () => e.response.data.message,
                    duration: 4,
                    style: {
                        color: 'red',
                        fontSize: 'large',
                    },
                });
            })
            .finally(() => {
                textButton.value = msg;
                cleanData();
            });

        if (me) {
            const user: LoggedUser = me.data;

            setLogin();

            setUser(user);

            setAvatar(user.avatar);

            if (user.isActive) {
                showMessage('success', 'Bienvenido', 2);
                router.push({ name: 'Dashboard' });
            } else {
                showMessage('error', 'Usuario no activo', 2);
                router.push({ name: 'Home' });
            }
        }
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
                            :rules="[
                                {
                                    required: true,
                                    message: 'El campo e-mail es requerido!',
                                },
                            ]"
                        >
                            <a-input type="email" v-model:value="loginData.username" />
                        </a-form-item>

                        <a-form-item
                            name="password"
                            initialValue="123456"
                            label="Contraseña"
                            :rules="[
                                {
                                    required: true,
                                    message: 'La contraseña es requerida!',
                                },
                            ]"
                        >
                            <a-input type="password" v-model:value="loginData.password" placeholder="Password" />
                        </a-form-item>
                        <!-- <div class="ninjadash-auth-extra-links">
						<a-checkbox @change="onChange">Keep me logged in</a-checkbox>
						<router-link class="forgot-pass-link" to="/auth/forgotPassword"> Forgot password? </router-link>
					</div> -->
                        <a-form-item>
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
                                <span>{{ textButton }}</span>
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
                    <br />
                    <!-- <p>Ir al inicio<router-link :to="{ name: 'Home' }">Inicio</router-link></p> -->
                </div>
            </AuthWrapper>
        </a-col>
    </a-row>
</template>
