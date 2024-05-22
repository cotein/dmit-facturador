import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { theme } from './src/config/theme/themeVariables';
import copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		rollupOptions: {
			external: ['vue-unicons/dist/icons'],
		},
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag: string) => {
						tag.startsWith('v-' || 'sd' || 'SearchOutlined');
					},
				},
			},
		}),
		vueJsx(),
		Components({
			resolvers: [AntDesignVueResolver()],
		}),
		copy({
			targets: [
				{
					src: `/src/assets/vendor/bootstrap/css/bootstrap.min.css`,
					dest: 'dist/vendor/bootstrap/css/bootstrap.min.css`',
				},
				{
					src: `/src/assets/vendor/bootstrap-icons/bootstrap-icons.css`,
					dest: 'dist/vendor/bootstrap-icons/bootstrap-icons.css`',
				},
				{
					src: `/src/assets/vendor/boxicons/css/boxicons.min.css`,
					dest: 'dist/vendor/boxicons/css/boxicons.min.css`',
				},
				{ src: `/src/assets/vendor/remixicon/remixicon.css`, dest: 'dist/vendor/remixicon/remixicon.css`' },
				{
					src: `/src/assets/vendor/swiper/swiper-bundle.min.css`,
					dest: 'dist/vendor/swiper/swiper-bundle.min.css`',
				},
				{ src: `/src/assets/vendor/css/style.css`, dest: 'dist/vendor/css/style.css`' },
				{
					src: `/src/assets/vendor/bootstrap/js/bootstrap.bundle.min.js`,
					dest: 'dist/vendor/bootstrap/js/bootstrap.bundle.min.js`',
				},
				{
					src: `/src/assets/vendor/isotope-layout/isotope.pkgd.min.js`,
					dest: 'dist/vendor/bootstrap/js/bootstrap.bundle.min.js`',
				},
				{
					src: `/src/assets/vendor/php-email-form/validate.js`,
					dest: 'dist/vendor/bootstrap/js/bootstrap.bundle.min.js`',
				},
				{
					src: `/src/assets/vendor/swiper/swiper-bundle.min.js`,
					dest: 'dist/vendor/bootstrap/js/bootstrap.bundle.min.js`',
				},
				{
					src: `/src/assets/vendor/waypoints/noframework.waypoints.js`,
					dest: 'dist/vendor/bootstrap/js/bootstrap.bundle.min.js`',
				},
				{ src: `/src/assets/vendor/js/main.js`, dest: 'dist/vendor/bootstrap/js/bootstrap.bundle.min.js`' },
			],
			hook: 'writeBundle', // ensure the files are copied before the bundle is written
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	css: {
		preprocessorOptions: {
			less: {
				modifyVars: {
					...theme,
				},
				javascriptEnabled: true,
			},
		},
	},
	base:
		process.env.NODE_ENV === 'production'
			? process.env.VITE_URL_BASE_API
				? process.env.VITE_URL_BASE_API
				: process.env.VITE_URL_BASE_API
			: 'http://localhost:8001',
});
