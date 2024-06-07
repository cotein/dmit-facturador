import { createWebHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import authRoutes from './authRoutes';
import systemRoutes from './systemRoutes';
import customerRoutes from './customer';
import { useUserStore } from '@/app/store/user/user-store';
import { useStoreCompany } from '@/app/store/company/store-company';
import { useOpenCompanyPanelStore } from '@/app/store/panels/useOpenCompanyPanelStore';
import { useAddNewCompanyPanelStore } from '@/app/store/panels/useAddNewCompanyPanelStore';

const routes: Array<RouteRecordRaw> = [
    {
        name: 'Home',
        path: '/',
        component: () => import('@/app/layout/LandingLayout.vue'),
        meta: { auth: false },
    },
    {
        name: 'email-verify',
        path: '/email/verify',
        component: () => import('@/app/pages/EmailVerification.vue'),
        props: (route) => ({ query: route.query.q }),
    },
    {
        name: 'delegate-afip-service',
        path: '/delegar-servicio-en-afip',
        component: () => import('@/app/pages/AfipDelegateService.vue'),
    },
    {
        name: 'Auth',
        path: '/auth',
        component: () => import('@/app/layout/AuthLayout.vue'),
        children: [...authRoutes],
    },
    {
        name: 'panel',
        path: '/sistema',
        component: () => import('@/app/layout/AdminLayout.vue'),
        children: [...systemRoutes, ...customerRoutes],
        meta: { auth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes,
});

router.beforeEach((to, from, next) => {
    const { openPanelCompanies } = useOpenCompanyPanelStore();

    const { openAddNewCompanyPanel } = useAddNewCompanyPanelStore();

    const { IHaveMoreThanOneCompany, AuthUser, UserGetter, IHaventGotCompanies, IHaveOneCompany } = useUserStore();

    const { setCompanyToWork } = useStoreCompany();

    if (to.meta.auth && !AuthUser) {
        next({ name: 'login' });
    } else {
        //if (from.path === '/auth/login' && to.meta.auth) {
        if (from.path === '/auth/login' && to.meta.auth) {
            if (IHaventGotCompanies) openAddNewCompanyPanel();

            if (IHaveOneCompany) setCompanyToWork(UserGetter.value.companies[0]);

            if (IHaveMoreThanOneCompany) openPanelCompanies();
        }
        next();
    }
    window.scrollTo(0, 0); // reset scroll position to top of page
});

export default router;
