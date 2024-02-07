import app from './config/configApp';
import router from './app/router';
import store from './vuex/store';
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
import DatePicker from 'ant-design-vue/es/date-picker/moment';

const pinia = createPinia();
app.component('SearchOutlined', SearchOutlined);
app.component('NavTitle', NavTitle);
app.config.globalProperties.$filters = {
	timeAgo(date: any) {
		return moment(date).fromNow();
	},
	argentinianDate(date: any) {
		return moment(date).format('DD/MM/YYYY');
	},
	afipDate(date: any) {
		return moment(date).format('YYYYMMDD');
	},
	formatCurrency(value: number): string {
		const formattedValue = value
			.toFixed(2)
			.replace(/\./g, ',')
			.replace(/\d(?=(\d{3})+,)/g, '$&.');
		return `$${formattedValue}`;
	},
};

//app.use(DatePicker);
app.use(store);
app.use(pinia);
app.use(VueQueryPlugin);
app.use(router);
app.component('QuillEditor', QuillEditor);
app.mount('#app');
