import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { theme } from './src/config/theme/themeVariables';

// https://vitejs.dev/config/
export default defineConfig({
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
