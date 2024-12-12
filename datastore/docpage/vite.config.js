"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const node_url_1 = require("node:url");
const vite_plugin_prismjs_1 = require("vite-plugin-prismjs");
const plugin_vue_1 = require("@vitejs/plugin-vue");
const vite_svg_loader_1 = require("vite-svg-loader");
const outDir = process.env.BUILD_DIR ?? 'build';
const isDevelopment = !['production', 'test'].includes(process.env.NODE_ENV);
exports.default = (0, vite_1.defineConfig)({
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern',
            },
        },
    },
    base: isDevelopment ? undefined : './',
    build: {
        rollupOptions: {
            input: {
                index: (0, node_url_1.fileURLToPath)(new URL('./index.html', import.meta.url)),
            },
        },
        outDir: (0, node_url_1.fileURLToPath)(new URL(`../../${outDir}/datastore/docpage/dist`, import.meta.url)),
        // needed for commonjs to be activated for @ulixee deps
        commonjsOptions: { include: [/prismjs/] },
        emptyOutDir: true,
        sourcemap: 'inline',
    },
    plugins: [
        (0, plugin_vue_1.default)({
            template: {
                compilerOptions: {
                    whitespace: 'preserve',
                },
            },
        }),
        (0, vite_svg_loader_1.default)({
            svgoConfig: {
                multipass: true,
            },
        }),
        (0, vite_plugin_prismjs_1.default)({
            languages: ['javascript', 'typescript', 'shell'],
        }),
    ],
    resolve: {
        alias: {
            '@': (0, node_url_1.fileURLToPath)(new URL('./src', import.meta.url)),
        },
    },
});
//# sourceMappingURL=vite.config.js.map