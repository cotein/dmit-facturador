<template>
    <div>
        <Main>
            <MaintananceWrapper>
                <img :src="`/src/assets/img/pages/maintenance.svg`" alt="maintenance" />
                <sdHeading as="h2">Restalecimiento de contraseña</sdHeading>
                <a-row :gutter="[15, 15]">
                    <!-- Segunda columna: Ingreso de la nueva contraseña -->
                    <a-col
                        :xs="{ span: 22, offset: 1 }"
                        :xl="{ span: 14, offset: 5 }"
                        :md="{ span: 14, offset: 5 }"
                        :sm="{ span: 14, offset: 5 }"
                    >
                        <h2>Ingrese su nueva contraseña</h2>
                        <a-row :gutter="[15, 15]">
                            <a-col :span="24">
                                <a-input-password
                                    :disabled="loading"
                                    class="custom-input"
                                    :type="showNewPassword ? 'text' : 'password'"
                                    v-model:value="newPassword"
                                    placeholder="Nueva contraseña"
                                />
                            </a-col>
                            <a-col :span="24">
                                <a-input-password
                                    :disabled="loading"
                                    class="custom-input"
                                    :type="showConfirmPassword ? 'text' : 'password'"
                                    v-model:value="confirmPassword"
                                    placeholder="Confirme la nueva contraseña"
                                />
                            </a-col>
                        </a-row>
                        <a-button
                            :loading="loading"
                            class="button"
                            type="primary"
                            size="large"
                            :disabled="!isPasswordMatch || loading"
                            @click="resetPassword"
                        >
                            Restablecer contraseña
                        </a-button>
                        <p v-if="passwordMismatch" class="error-message">
                            Las contraseñas no coinciden
                        </p>
                    </a-col>
                </a-row>
            </MaintananceWrapper>
        </Main>
    </div>
</template>

<script setup lang="ts">
import { Main } from "../styled";
import { MaintananceWrapper } from "./style";
import { ref, computed, watch } from "vue";
import { apiResetPassword } from "@/api/auth/email-verification-api";
import { useSleepComposable } from "../composables/sleep/useSleepComposable";
import { showNotification } from "@/app/helpers/notifications";
import { useRoute } from "vue-router";

const loading = ref<boolean>(false);
const { sleep } = useSleepComposable();

const route = useRoute();
const token = route.query.token;

// Estado para almacenar la nueva contraseña y su confirmación
const newPassword = ref<string>("");
const confirmPassword = ref<string>("");

// Estado para controlar la visibilidad de las contraseñas
const showNewPassword = ref<boolean>(false);
const showConfirmPassword = ref<boolean>(false);

/* const isPasswordMatch = ref<boolean>(false); */
const passwordMismatch = ref<boolean>(false);

const isPasswordMatch = computed(() => {
    return (
        newPassword.value === confirmPassword.value &&
        newPassword.value !== "" &&
        confirmPassword.value !== ""
    );
});
const resetPassword = async () => {
    loading.value = true;
    if (
        newPassword.value !== "" &&
        confirmPassword.value !== "" &&
        newPassword.value === confirmPassword.value
    ) {
        if (token) {
            try {
                const response = await apiResetPassword(token, newPassword.value);
                if (response.status === 200) {
                    showNotification(
                        "success",
                        "Contraseña restablecida",
                        "Tu contraseña ha sido restablecida con éxito. Serás redirigido al inicio de sesión en 5 segundos.",
                        5
                    );
                    window.location.href = "/auth/login";
                }
            } catch (error) {
                showNotification(
                    "error",
                    "Error al restablecer la contraseña",
                    "Hubo un problema al restablecer tu contraseña. Por favor, intenta de nuevo más tarde.",
                    5
                );
            } finally {
                loading.value = false;
            }
        }
    }
};
</script>

<style scoped>
.custom-input {
    padding: 0 8px;
    vertical-align: middle;
    border-radius: 5px;
    width: 100%;
    min-height: 41px;
    background-color: #ffffff;
    border: 1px solid rgba(157, 155, 153, 0.491);
    transition: all 0.2s ease-in-out 0s;
    font-size: 16px;
    line-height: 18px;
    font-weight: normal;
    text-align: center;
}

.custom-input:focus {
    outline: none;
    border: 1px solid #a2d2df;
    box-shadow: inset 0 0 0 1px #007c89;
}

.button {
    margin-top: 1rem;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out 0s;
}
.error-message {
    color: red;
    margin-top: 10px;
}
</style>
