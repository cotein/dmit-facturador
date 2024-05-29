<script setup lang="ts">
import { Layout } from 'ant-design-vue';
import { Div, SmallScreenSearch, SmallScreenAuthInfo, TopMenuSearch } from './style';
import { computed, ref } from 'vue';
import HeaderSearch from '@/components/header-search/HeaderSearch.vue';
import AuthInfo from '@/app/components/auth-info/InfoAuth.vue';
import AsideItems from './Aside.vue';
import TopMenu from './TopMenuItems.vue';

/* import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'; */
import { useAppStore } from '../store/app/useAppStore';
import { useCompanyComposable } from '../composables/company/useCompanyComposable';
const { CompanyGetter } = useCompanyComposable();

const { Header, Footer, Sider, Content } = Layout;
const collapsed = ref(false);
const hide = ref(true);
const searchHide = ref(true);

const { state } = useAppStore();

const rtl = computed(() => state.rtlData);
const darkMode = computed(() => state.data);
const topMenu = computed(() => state.topMenu);
const innerWidth: number = window.innerWidth;
collapsed.value = window.innerWidth <= 1200 && true;

const toggleCollapsed = (e: Event) => {
	e.preventDefault();
	collapsed.value = !collapsed.value;
};
const handleSearchHide = (search: any) => {
	searchHide.value = !search;
	hide.value = true;
};
const onShowHide = (h: any) => {
	hide.value = !h;
	searchHide.value = true;
};

const toggleCollapsedMobile = () => {
	const aside = document.querySelector('.ps--active-y');
	if (aside) {
		aside.scrollTop = 0;
	}

	if (innerWidth <= 990) {
		collapsed.value = !collapsed.value;
	}
};
if (innerWidth <= 990) {
	document.body.addEventListener('click', (e: any) => {
		if (!e.target.closest('.ant-layout-sider') && !e.target.closest('.navbar-brand .ant-btn')) {
			collapsed.value = true;
		}
	});
}

const modeChangeSideNav = () => {
	//dispatch('changeMenuMode', false);
};

const onEventChange = {
	modeChangeSideNav,
};
</script>

<template>
	<Div :darkMode="darkMode">
		<Layout class="layout">
			<Header
				:style="{
					position: 'fixed',
					width: '100%',
					top: 0,
					[!rtl ? 'left' : 'right']: 0,
				}"
			>
				<div class="ninjadash-header-content d-flex">
					<div class="ninjadash-header-content__left">
						<div class="navbar-brand align-cener-v">
							<router-link
								:class="topMenu && innerWidth > 991 ? 'ninjadash-logo top-menu' : 'ninjadash-logo'"
								to="/"
							>
								<img
									:src="
										!darkMode
											? $environment.VITE_SRC_ASSETS + `/img/Logo_Dark.svg`
											: $environment.VITE_SRC_ASSETS + `/img/Logo_White.svg`
									"
									alt="logo"
								/>
							</router-link>
							<sdButton v-if="!topMenu || innerWidth <= 991" @click="toggleCollapsed" type="white">
								<img
									:src="$environment.VITE_SRC_ASSETS + `/img/icon/align-center-alt.svg`"
									alt="menu"
								/>
							</sdButton>
						</div>
					</div>
					<div class="ninjadash-header-content__right d-flex">
						<a-typography-title :level="3" style="padding-top: 1rem" v-if="CompanyGetter">
							{{ CompanyGetter.name }} {{ CompanyGetter.lastName }}</a-typography-title
						>
						<a-typography-text
							type="secondary"
							v-if="CompanyGetter && CompanyGetter.fantasy_name"
							style="padding-top: 1.5rem; padding-left: 1rem"
							>{{ CompanyGetter.fantasy_name }}</a-typography-text
						>
						<div class="ninjadash-navbar-menu d-flex align-center-v">
							<TopMenu v-if="topMenu && innerWidth > 991" />
						</div>
						<div class="ninjadash-nav-actions">
							<TopMenuSearch v-if="topMenu && innerWidth > 991">
								<div class="top-right-wrap d-flex">
									<AuthInfo />
								</div>
							</TopMenuSearch>
							<AuthInfo v-else />
						</div>
					</div>
					<div class="ninjadash-header-content__fluid">
						<div class="ninjadash-header-content__fluid__action">
							<a class="btn-search" @click="handleSearchHide(searchHide)" href="#">
								<unicon name="search" v-if="searchHide"></unicon>
								<unicon name="times" v-else></unicon>
							</a>
							<a class="btn-auth" @click="onShowHide(hide)" href="#">
								<unicon name="ellipsis-v"></unicon>
							</a>
						</div>
					</div>
					<!-- <a-col :lg="!topMenu ? 14 : 15" :md="8" :sm="0" :xs="0">

            <HeaderSearch v-else />
          </a-col> -->

					<!-- <a-col :style="{ position: 'static' }" :md="0" :sm="18" :xs="12">
            <div class="mobile-action">
              <a class="btn-search" @click="handleSearchHide(searchHide)" href="#">
                <unicon name="search" v-if="searchHide"></unicon>
                <unicon name="x" v-else></unicon>
              </a>
              <a class="btn-auth" @click="onShowHide(hide)" href="#">
                <unicon name="ellipsis-v"><unicon>
              </a>
            </div>
          </a-col> -->
				</div>
			</Header>
			<div class="header-more">
				<a-row>
					<a-col :md="0" :sm="24" :xs="24">
						<div class="small-screen-headerRight">
							<SmallScreenSearch :hide="searchHide" :darkMode="darkMode">
								<!-- <HeaderSearch /> -->
							</SmallScreenSearch>
							<SmallScreenAuthInfo :hide="hide" :darkMode="darkMode">
								<AuthInfo :rtl="rtl" />
							</SmallScreenAuthInfo>
						</div>
					</a-col>
				</a-row>
			</div>
			<Layout>
				<template v-if="!topMenu || innerWidth <= 991">
					<Sider
						:width="280"
						:style="{
							margin: '72px 0 0 0',
							padding: `${!rtl ? '20px 20px 55px 0px' : '20px 0px 55px 20px'}`,
							overflowY: 'auto',
							height: '100vh',
							position: 'fixed',
							[!rtl ? 'left' : 'right']: 0,
							zIndex: 998,
						}"
						:collapsed="collapsed"
						:theme="!darkMode ? 'light' : 'dark'"
					>
						<perfect-scrollbar
							:options="{
								wheelSpeed: 1,
								swipeEasing: true,
								suppressScrollX: true,
							}"
						>
							<AsideItems
								:toggleCollapsed="toggleCollapsedMobile"
								:topMenu="topMenu"
								:rtl="rtl"
								:darkMode="darkMode"
								:events="onEventChange"
							/>
						</perfect-scrollbar>
					</Sider>
				</template>
				<Layout class="ninjadash-main-layout">
					<Content>
						<!-- <router-view v-slot="{ Component }">
							<suspense>
								<component :is="Component" />
							</suspense>
						</router-view> -->
						<RouterView v-slot="{ Component }">
							<template v-if="Component">
								<Suspense>
									<component :is="Component"></component>
									<template #fallback>
										<div class="spin">
											<a-spin />
										</div>
									</template>
								</Suspense>
							</template>
						</RouterView>

						<Footer
							class="admin-footer"
							:style="{
								padding: '20px 30px 18px',
								color: 'rgba(0, 0, 0, 0.65)',
								fontSize: '14px',
								background: 'rgba(255, 255, 255, .90)',
								width: '100%',
								boxShadow: '0 -5px 10px rgba(146,153,184, 0.05)',
							}"
						>
							<a-row>
								<a-col :md="12" :xs="24">
									<span class="admin-footer__copyright"
										>2023 ©
										<a href="http://www.dmit.ar" style="">DMIT</a>
									</span>
								</a-col>
								<a-col :md="12" :xs="24">
									<div class="admin-footer__links">
										<!-- <router-link to="/app/social/profile/overview">Profile</router-link>
										<router-link to="/app/users/team">Team</router-link>
										<router-link to="/app/contact/contact-grid">Contacts</router-link> -->
									</div>
								</a-col>
							</a-row>
						</Footer>
					</Content>
				</Layout>
			</Layout>
		</Layout>
	</Div>
</template>

<style scoped>
.ps {
	height: calc(100vh - 100px);
}
.ant-layout-sider-collapsed .ps {
	height: calc(100vh - 70px);
}
</style>
