import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { theme } from './src/config/theme/themeVariables';
import copy from 'rollup-plugin-copy';
import compression from 'vite-plugin-compression';
import { terser } from 'rollup-plugin-terser';
import { createHtmlPlugin } from 'vite-plugin-html';
// https://vitejs.dev/config/
const isProduction = process.env.NODE_ENV === 'production';
export default defineConfig({
    /* build: {
		rollupOptions: {
			external: ['vue-unicons/dist/icons'],
		},
	}, */
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
        createHtmlPlugin({
            minify: isProduction,
        }),
        vueJsx(),
        compression(),
        Components({
            resolvers: [AntDesignVueResolver()],
        }),
        copy({
            targets: [{ src: 'src/assets/*', dest: 'dist/assets' }],

            hook: 'writeBundle', // ensure the files are copied before the bundle is written
        }),
    ],
    build: {
        rollupOptions: {
            plugins: isProduction
                ? [
                    terser({
                          compress: {
                            drop_console: true,
                            drop_debugger: true,
                        },
                        format: {
                              comments: false,
                        },
                    }),
                  ]
                : [],
        },
    },
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
    define: {
        __VUE_PROD_DEVTOOLS__: JSON.stringify(true),
    },
    base:
        process.env.NODE_ENV === 'production'
            ? process.env.VITE_URL_BASE_API
                ? process.env.VITE_URL_BASE_API
                : process.env.VITE_URL_BASE_API
            : 'http://localhost:7000',
});
