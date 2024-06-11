<script setup lang="ts">
import { InfoWraper, UserDropDown } from './auth-info-style';
import { LogoutOutlined } from '@ant-design/icons-vue';
import { useAddNewCompanyPanelComposable } from '@/app/composables/panels/useAddNewCompanyPanelComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useRouter } from 'vue-router';
import { useUserComposable } from '@/app/composables/user/useUserComposable';
import { usePadronComposable } from '@/app/composables/afip/usePadronComposable';
import Settings from './Settings.vue';
import EditCompanyForm from '@/app/components/company/EditCompanyForm.vue';
import { ref } from 'vue';

const { sujetoIsEditable } = usePadronComposable();
const { CompanyGetter, updateCompanyMutation, setCompany } = useCompanyComposable();
const { openEditCompanyPanel, closeEditCompanyPanel, EditCompanyPanel } = useAddNewCompanyPanelComposable();
const { push } = useRouter();
const { UserGetter, Avatar } = useUserComposable();

const infoUserVisible = ref(false);

const SignOut = (e: any) => {
    e.preventDefault();
    push('/auth/login');
};

const closeEditPanel = () => {
    sujetoIsEditable.value = false;
    closeEditCompanyPanel();
};
const openEditPanel = async () => {
    infoUserVisible.value = false;
    setTimeout(() => {
        sujetoIsEditable.value = true;
        if (CompanyGetter.value) {
            setCompany(CompanyGetter.value);
        }
        openEditCompanyPanel();
    }, 150);
};
</script>

<template>
    <a-drawer title="Editar datos de la compañía" width="80%" :visible="EditCompanyPanel" @close="closeEditPanel">
        <EditCompanyForm
            @submitCompanyForm="handleSubmitCompanyForm"
            :loadingButton="!updateCompanyMutation.isLoading"
        />
    </a-drawer>
    <InfoWraper>
        <!-- <SearchBar /> -->
        <!-- <DarkMode /> -->
        <!-- <Message />
		<Notification /> -->
        <Settings />
        <!-- <Support /> -->
        <div class="ninjadash-nav-actions__item ninjadash-nav-actions__author">
            <a-popover placement="bottomRight" :visible="infoUserVisible" @click="infoUserVisible = !infoUserVisible">
                <template v-slot:content>
                    <UserDropDown>
                        <div class="user-dropdown">
                            <figure class="user-dropdown__info">
                                <a-avatar :src="Avatar" />
                                <figcaption>
                                    <sdHeading as="h5">{{ UserGetter.value.name }}</sdHeading>
                                    <p v-if="CompanyGetter">
                                        {{ CompanyGetter.name }}
                                        {{ CompanyGetter.lastName }}
                                    </p>
                                </figcaption>
                            </figure>
                            <ul class="user-dropdown__links">
                                <li>
                                    <a to="#" @click.prevent="openEditPanel">
                                        <unicon name="building"></unicon> Editar compañía
                                    </a>
                                </li>
                            </ul>
                            <a @click="SignOut" class="user-dropdown__bottomAction" href="#">
                                <LogoutOutlined /> Cerrar sesión
                            </a>
                        </div>
                    </UserDropDown>
                </template>
                <a to="#" class="ninjadash-nav-action-link">
                    <a-avatar :src="Avatar" />
                    <span class="ninjadash-nav-actions__author--name">{{ UserGetter.value.name }}</span>
                    <unicon name="angle-down"></unicon>
                </a>
            </a-popover>
        </div>
    </InfoWraper>
</template>
<style>
.avatar {
    width: 64px;
    height: 64px;
    max-width: 64px;
    max-height: 64px;
}
.ant-drawer-content-wrapper {
    transition-duration: 1.5s !important;
}
</style>
