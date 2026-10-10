import { createWebHistory, createRouter } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import authRoutes from './authRoutes';
import systemRoutes from './systemRoutes';
import customerRoutes from './customer';
import arbaCotRoutes from './arbaCot';
import { useUserStore } from '@/app/store/user/user-store';
import { useStoreCompany } from '@/app/store/company/store-company';
import { useOpenCompanyPanelStore } from '@/app/store/panels/useOpenCompanyPanelStore';
import { useAddNewCompanyPanelStore } from '@/app/store/panels/useAddNewCompanyPanelStore';
import { showNotification } from '@/app/helpers/notifications';
// El aviso de la vuelta de Mercado Pago se muestra desde el guard, que corre
// antes de que se monte cualquier pantalla: el estilo se importa acá para que la
// notificación no salga sin formato si el usuario aterriza directo en esa ruta.
import 'ant-design-vue/lib/notification/style/index.css';

const routes: Array<RouteRecordRaw> = [
    /* {
        name: 'Home',
        path: '/',
        component: () => import('@/app/layout/LandingLayout.vue'),
        meta: { auth: false },
    }, */
    {
        name: 'Home',
        path: '/',
        component: () => import('@/app/layout/AuthLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('@/app/pages/authentication/SignIn.vue'),
            },
        ],
        meta: { auth: false },
    },
    {
        name: 'email-verifycation',
        path: '/verify-email',
        component: () => import('@/app/pages/EmailVerification.vue'),
        props: (route) => ({ token: route.query.token }),
    },
    {
        name: 'delegate-afip-service',
        path: '/delegar-servicio-en-afip',
        component: () => import('@/app/pages/AfipDelegateService.vue'),
    },
    {
        name: 'renew-password',
        path: '/restablecer-contrasena',
        component: () => import('@/app/pages/UserForgotPassword.vue'),
        props: (route) => ({ token: route.query.token }),
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
        children: [...systemRoutes, ...customerRoutes, ...arbaCotRoutes],
        meta: { auth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes,
});

// Valida la sesión guardada una sola vez por carga de página: si el token venció,
// se limpia la sesión y el guard manda al login.
// El import es dinámico a propósito: src/api/base-api.ts resuelve el store al cargarse
// como módulo, así que no puede entrar en el grafo de imports inicial (todavía no hay
// Pinia activa cuando se evalúan los imports de main.ts).
let sessionValidated = false;

const restoreStoredSession = async (): Promise<boolean> => {
    const userStore = useUserStore();

    if (!userStore.UserTokenGetter) {
        return true;
    }

    try {
        const { getMyData } = await import('@/api/user/user-api');
        const { data } = await getMyData();

        userStore.setUser(data);
        userStore.setAvatar(data.avatar);
        userStore.setLogin();

        return true;
    } catch (error) {
        userStore.clearSession();

        return false;
    }
};

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();

    // --- Vuelta de Mercado Pago -------------------------------------------------
    // Conectar la cuenta sale del navegador hacia Mercado Pago (window.location.href
    // en useMercadoPagoChargesComposable), así que la vuelta es una carga COMPLETA de
    // la página: el callback de la API redirige a MERCADOPAGO_BACK_URL, que es la raíz
    // del facturador, con '?mp=connected' o '?mp=error'.
    //
    // La raíz es la pantalla de login, y ahí nadie miraba ese parámetro: el usuario
    // logueado volvía a ver el formulario de ingreso como si se hubiera deslogueado,
    // cuando la sesión seguía guardada en localStorage ('dmit.session'). Acá se atiende
    // el resultado: se avisa y se entra al panel (o al login si de verdad no hay sesión).
    const resultadoMercadoPago = to.query.mp;

    if (resultadoMercadoPago === 'connected' || resultadoMercadoPago === 'error') {
        const haySesion = userStore.AuthUser;

        if (resultadoMercadoPago === 'connected') {
            showNotification(
                'success',
                'Mercado Pago conectado',
                'La cuenta quedó conectada: los cobros de la empresa entran directo a esa cuenta.',
                6,
            );
        } else {
            const motivo = to.query.message;

            showNotification(
                'error',
                'No se pudo conectar Mercado Pago',
                typeof motivo === 'string' && motivo ? motivo : 'Volvé a intentar la conexión desde Cobros online.',
                10,
            );
        }

        // Se navega a una ruta SIN el parámetro: si quedara en la URL, cada recargue
        // volvería a mostrar el mismo aviso.
        next({ name: haySesion ? 'OnlineChargesList' : 'login' });

        return;
    }

    // La raíz del sitio es el login: con la sesión guardada no tiene sentido volver a
    // mostrarlo (es lo que hacía parecer perdida la sesión al volver de Mercado Pago,
    // y también al entrar a facturador.dmit.ar con la sesión ya abierta).
    const esLaRaizDelSitio = to.matched.some((record) => record.name === 'Home');

    if (esLaRaizDelSitio && userStore.AuthUser) {
        // La validación de la sesión la hace el guard al entrar a la ruta con auth:
        // si el token venció, ahí se limpia y se cae al login.
        next({ name: 'Dashboard' });

        return;
    }

    if (to.meta.auth && !sessionValidated) {
        sessionValidated = true;

        const sessionIsValid = await restoreStoredSession();

        if (!sessionIsValid) {
            next({ name: 'login' });

            return;
        }
    }

    const { openPanelCompanies } = useOpenCompanyPanelStore();

    const { openAddNewCompanyPanel } = useAddNewCompanyPanelStore();

    const { IHaveMoreThanOneCompany, AuthUser, UserGetter, IHaventGotCompanies, IHaveOneCompany } = userStore;

    const { setCompanyToWork, CompanyGetter } = useStoreCompany();

    if (to.meta.auth && !AuthUser) {
        next({ name: 'login' });
    } else {
        // La empresa activa se fija igual viniendo del login o recargando una ruta /sistema/*:
        // antes esto sólo corría con from.path === '/auth/login', así que una recarga completa
        // dejaba CompanyGetter vacío y las pantallas que dependen de la empresa no cargaban
        // nada (catálogo incluido). Se fija una sola vez: si ya hay empresa, no se pisa la que
        // el usuario haya elegido en el panel.
        if (to.meta.auth && !CompanyGetter?.id) {
            if (IHaventGotCompanies) openAddNewCompanyPanel();

            // Ojo: UserGetter del store es un ref doble (el getter es computed(() => user),
            // no computed(() => user.value)), por eso acá va .value.
            if (IHaveOneCompany) setCompanyToWork(UserGetter.value.companies[0]);

            if (IHaveMoreThanOneCompany) openPanelCompanies();
        }
        next();
    }
    window.scrollTo(0, 0); // reset scroll position to top of page
});

export default router;
