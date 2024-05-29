<script setup lang="ts">
import type { Company } from '@/app/types/Company';
import { InfoWraper, UserDropDown } from './auth-info-style';
import { LogoutOutlined } from '@ant-design/icons-vue';
import { useAddNewCompanyPanelComposable } from '@/app/composables/panels/useAddNewCompanyPanelComposable';
import { useCompanyComposable } from '@/app/composables/company/useCompanyComposable';
import { useRouter } from 'vue-router';
import { useUserComposable } from '@/app/composables/user/useUserComposable';
import { usePadronComposable } from '@/app/composables/afip/usePadronComposable';
import Message from './Message.vue';
import Notification from './Notification.vue';
import Settings from './Settings.vue';
import EditCompanyForm from '@/app/components/company/EditCompanyForm.vue';

const { sujetoIsEditable } = usePadronComposable();
const { CompanyGetter, updateCompanyMutation, setCompany } = useCompanyComposable();
const { openAddNewCompanyPanel, openEditCompanyPanel, closeEditCompanyPanel, EditCompanyPanel } =
	useAddNewCompanyPanelComposable();
const { push } = useRouter();
const { UserGetter, Avatar } = useUserComposable();

const SignOut = (e: any) => {
	e.preventDefault();
	push('/auth/login');
};

const handleCustomEvent = (data: Company) => {
	/* console.log('🚀  Estoy dentro de handleCustomEvent en aside para crear una compañía nueva');
	updateCompanyMutation.mutateAsync(data); */
	closeEditCompanyPanel();
};

const closeEditPanel = () => {
	sujetoIsEditable.value = false;
	closeEditCompanyPanel();
};
const openEditPanel = () => {
	sujetoIsEditable.value = true;
	if (CompanyGetter.value) {
		setCompany(CompanyGetter.value);
	}
	openEditCompanyPanel();
};
</script>

<template>
	<a-drawer title="Editar datos de la compañía" width="80%" :visible="EditCompanyPanel" @close="closeEditPanel">
		<EditCompanyForm @submitCompanyForm="handleCustomEvent" :loadingButton="!updateCompanyMutation.isLoading" />
	</a-drawer>
	<InfoWraper>
		<!-- <SearchBar /> -->
		<!-- <DarkMode /> -->
		<!-- <Message />
		<Notification /> -->
		<Settings />
		<!-- <Support /> -->
		<div class="ninjadash-nav-actions__item ninjadash-nav-actions__author">
			<a-popover placement="bottomRight" action="click">
				<template v-slot:content>
					<UserDropDown>
						<div class="user-dropdown">
							<figure class="user-dropdown__info">
								<a-avatar :src="Avatar" />
								<figcaption>
									<sdHeading as="h5">{{ UserGetter.value.name }}</sdHeading>
									<p v-if="CompanyGetter">{{ CompanyGetter.name }} {{ CompanyGetter.lastName }}</p>
								</figcaption>
							</figure>
							<ul class="user-dropdown__links">
								<!-- <li>
									<a to="#" @click.prevent="">
										<unicon name="building"></unicon> Cambiar de Compañía
									</a>
								</li>
								<li>
									<a to="#" @click.prevent="openAddNewCompanyPanel">
										<unicon name="building"></unicon> Ingresar una compañía
									</a>
								</li> -->
								<li>
									<a to="#" @click.prevent="openEditPanel">
										<unicon name="building"></unicon> Editar compañía
									</a>
								</li>
								<!-- <li>
									<a to="#"> <unicon name="bell"></unicon> Help </a>
								</li> -->
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
</style>
