import app from './config/configApp';
import router from './app/router';
//import 'ant-design-vue/dist/antd.css';
import './assets/main.css';
// Vue 3rd party plugins
import '@/core/plugins/ant-design';
import '@/core/plugins/unicons';
import '@/core/plugins/apexcharts';
import '@/core/plugins/fonts';
import '@/core/plugins/ckEditor';
import '@/core/plugins/maps';
import '@/core/components/custom';
import '@/core/components/style';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { SearchOutlined } from '@ant-design/icons-vue';
import { NavTitle } from './app/layout/style';
import moment from 'moment';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import 'vue3-perfect-scrollbar/style.css';
import vue3GoogleLogin from 'vue3-google-login';

app.use(createPinia());

app.use(vue3GoogleLogin, {
    clientId: '52556351943-3lonos68ihpsaq3le6l2d6irbumkm5g1.apps.googleusercontent.com',
});

app.component('SearchOutlined', SearchOutlined);

app.component('NavTitle', NavTitle);

app.config.globalProperties.$filters = {
    timeAgo(date: any) {
        return moment(date).fromNow();
    },
    argentinianDate(date: any) {
        return moment(date).format('DD-MM-YYYY');
    },
    afipDate(date: any) {
        return moment(date).format('YYYYMMDD');
    },
    formatCurrency(value: number, useToFixed: boolean = true) {
        if (value === null) {
            return '';
        }

        let formattedValue = value.toString();

        if (useToFixed) {
            formattedValue = value
                .toFixed(2)
                .replace(/\./g, ',')
                .replace(/\d(?=(\d{3})+,)/g, '$&.');
        } else {
            formattedValue = formattedValue.replace(/\./g, ',').replace(/\d(?=(\d{3})+,)/g, '$&.');
        }
        return `$${formattedValue}`;
    },
    formatNumberWithThousandsSeparator(value: number) {
        if (value === null || value === undefined) {
            return '';
        }

        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
};

app.config.globalProperties.$environment = import.meta.env;

app.use(PerfectScrollbarPlugin);
app.use(VueQueryPlugin);
app.use(router);

app.component('QuillEditor', QuillEditor);

app.mount('#app');

if (import.meta.env.MODE === 'DEVELOPMENT') {
    console.log('🚀 ~ development:', 'development');
} else if (import.meta.env.MODE === 'PRODUCTION') {
    console.log('🚀 ~ production:', 'PRODUCTION');
}
