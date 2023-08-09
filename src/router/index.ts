import { createWebHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import adminRoutes from './adminRoutes';
import authRoutes from './authRoutes';
import { useUserStore } from '@/store/user/user-store';

const routes: Array<RouteRecordRaw> = [
	/* {
		name: 'Admin',
		path: '/',
		component: () => import('../layout/AdminLayout.vue'),
		children: [...adminRoutes],
		meta: { auth: false },
	}, */

	{
		name: 'email-verify',
		path: '/email/verify',
		component: () => import('./../app/pages/EmailVerification.vue'),
		props: (route) => ({ query: route.query.q }),
	},
	{
		name: 'Auth',
		path: '/auth',
		component: () => import('./../layout/AuthLayout.vue'),
		children: [...authRoutes],
		//meta: { auth: true },
	},
	{
		name: 'delegate-afip-service',
		path: '/delegar-servicio-en-afip',
		component: () => import('../app/pages/AfipDelegateService.vue'),
	},
	{
		name: 'system',
		path: '/',
		component: () => import('../layout/AdminLayout.vue'),

		children: [
			{
				name: 'company',
				path: '/empresa',
				component: () => import('../app/pages/FormCompany.vue'),
				children: [],
				meta: { auth: true },
			},
			{
				name: 'customers',
				path: '/clientes',
				children: [
					{
						path: '/nuevo',
						name: 'NewCustomer',
						component: () => import('../views/forms/FormValidation.vue'),
					},
				],
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	linkExactActiveClass: 'active',
	routes,
});

router.beforeEach((to, from, next) => {
	const userStore = useUserStore();

	if (to.meta.auth && !userStore.Auth) {
		next({ name: 'login' });
	} else {
		next();
	}
	window.scrollTo(0, 0); // reset scroll position to top of page
});

export default router;
