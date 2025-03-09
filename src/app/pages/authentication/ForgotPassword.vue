<script setup lang="ts">
import { reactive, ref } from "vue";
import { AuthWrapper } from "./style";
import { computed } from "vue";
import { apiEmailForgotPasswordResetCode } from "@/api/auth/email-verification-api";
import { showNotification } from "@/app/helpers/notifications";

const loading = ref(false);

const formState = reactive({
    email: "",
});

const sendInstrucctions = async () => {
    loading.value = true;
    try {
        const response = await apiEmailForgotPasswordResetCode(formState.email);

        showNotification(
            "success",
            "Instrucciones enviadas",
            "Te hemos enviado un correo con las instrucciones para restablecer tu contraseña.",
            5
        );
    } catch (error) {
        // Handle error
        showNotification(
            "error",
            "Error al enviar instrucciones",
            error.response.data.message,
            5
        );
    } finally {
        loading.value = false;
    }
};

const isEmailValid = computed(() => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(formState.email);
});
</script>

<template>
    <a-row justify="center">
        <a-col :xxl="6" :xl="12" :md="12" :sm="18">
            <AuthWrapper>
                <div class="ninjadash-authentication-top">
                    <h2 class="ninjadash-authentication-top__title">
                        ¿Olvidate tu contraseña?
                    </h2>
                </div>
                <div class="ninjadash-authentication-content">
                    <a-form
                        @finish="sendInstrucctions"
                        :model="formState"
                        layout="vertical"
                    >
                        <p class="forgot-text">
                            Ingresa la dirección de correo electrónico que usaste cuando
                            te registraste y te enviaremos instrucciones para restablecer
                            tu contraseña.
                        </p>
                        <a-form-item label="Dirección de correo electrónico" name="email">
                            <a-input
                                type="email"
                                v-model:value="formState.email"
                                placeholder="name@example.com"
                                :disabled="loading"
                            />
                        </a-form-item>
                        <a-form-item>
                            <a-button
                                class="btn-reset"
                                htmlType="submit"
                                type="primary"
                                size="lg"
                                @click="sendInstrucctions"
                                :disabled="loading || !isEmailValid"
                            >
                                Enviar instrucciones
                            </a-button>
                        </a-form-item>
                        <p class="return-text">
                            Regresar a: <router-link to="/auth/login">Login</router-link>
                        </p>
                    </a-form>
                </div>
            </AuthWrapper>
        </a-col>
    </a-row>
</template>
