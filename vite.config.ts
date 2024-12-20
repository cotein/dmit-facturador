import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { theme } from './src/config/theme/themeVariables';
import copy from 'rollup-plugin-copy';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
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
    /*  build: {
        minify: 'terser', // Usa Terser para minificar el código
        terserOptions: {
            compress: {
                drop_console: true, // Elimina los console.log en producción
            },
        },
        chunkSizeWarningLimit: 500, // Ajusta el límite de advertencia de tamaño de chunk
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    }
                },
            },
        },
    }, */
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
