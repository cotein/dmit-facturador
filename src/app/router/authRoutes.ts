const routes = [
    {
        path: 'login',
        name: 'login',
        component: () => import('@/app/pages/authentication/SignIn.vue'),
    },
    {
        path: 'register',
        name: 'register',
        component: () => import('@/app/pages/authentication/SignUp.vue'),
    },
    {
        path: 'forgotPassword',
        name: 'forgotPassword',
        component: () => import('@/app/pages/authentication/ForgotPassword.vue'),
    },
];

export default routes;
