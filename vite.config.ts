import { fileURLToPath, URL } from 'node:url';
import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import { theme } from './src/config/theme/themeVariables';
import compression from 'vite-plugin-compression';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
const isProduction = process.env.NODE_ENV === 'production';

// Los archivos de src/assets se referencian por URL desde el código (no con import),
// así que hay que copiarlos tal cual a dist. Se hace con node:fs para no depender de
// rollup-plugin-copy, que traía su propia versión de rollup y rompía los tipos del config.
const copyAssetsPlugin = (): Plugin => ({
    name: 'dmit-copy-assets',
    apply: 'build',
    writeBundle() {
        const origin = 'src/assets';
        const destination = 'dist/assets';

        mkdirSync(destination, { recursive: true });

        for (const entry of readdirSync(origin)) {
            cpSync(`${origin}/${entry}`, `${destination}/${entry}`, { recursive: true });
        }
    },
});

// Reemplaza a rollup-plugin-terser: esbuild ya viene con Vite y hace lo mismo.
const dropOptions: ('console' | 'debugger')[] = isProduction ? ['console', 'debugger'] : [];

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
        createHtmlPlugin({
            minify: isProduction,
        }),
        vueJsx(),
        compression(),
        Components({
            // importStyle: 'less' hace que cada componente de Ant traiga su .less y se compile
            // con los modifyVars de abajo (el tema de src/config/theme/themeVariables.ts).
            // Con el CSS precompilado por defecto, los tokens del tema no llegaban a Ant y los
            // botones primarios quedaban con el azul #1890FF en vez del primario del sistema.
            resolvers: [AntDesignVueResolver({ importStyle: 'less' })],
        }),
        copyAssetsPlugin(),
    ],
    esbuild: {
        drop: dropOptions,
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
    base: isProduction ? process.env.VITE_URL_BASE_API : 'http://localhost:7000',
});
