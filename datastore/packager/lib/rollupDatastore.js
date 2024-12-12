"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = rollupDatastore;
const rollup_1 = require("rollup");
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const plugin_replace_1 = require("@rollup/plugin-replace");
const plugin_json_1 = require("@rollup/plugin-json");
const Resolvable_1 = require("@ulixee/commons/lib/Resolvable");
const TypedEventEmitter_1 = require("@ulixee/commons/lib/TypedEventEmitter");
const sourcemaps_1 = require("./sourcemaps");
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
async function rollupDatastore(scriptPath, options = {}) {
    const outDir = options.outDir ?? `${__dirname}/../`;
    const plugins = [
        (0, plugin_node_resolve_1.nodeResolve)({
            resolveOnly: module => {
                return !module.startsWith('@ulixee');
            },
        }),
        commonjs({ transformMixedEsModules: true, extensions: ['.js', '.ts'] }), // the ".ts" extension is required }),
        (0, plugin_json_1.default)(),
    ];
    if (scriptPath.endsWith('.ts')) {
        plugins.unshift((0, plugin_replace_1.default)({
            preventAssignment: true,
            values: {
                'import * as moment': 'import moment',
            },
        }), typescript({
            compilerOptions: {
                composite: false,
                sourceMap: true,
                inlineSourceMap: false,
                inlineSources: true,
                declaration: false,
                checkJs: false,
                target: 'ES2021',
            },
            outputToFilesystem: false,
            tsconfig: options?.tsconfig,
        }));
    }
    else {
        plugins.unshift((0, sourcemaps_1.default)());
    }
    const outFile = `${outDir}/datastore.js`;
    const emitter = new TypedEventEmitter_1.default();
    const resolvable = new Resolvable_1.default();
    try {
        const config = {
            input: scriptPath,
            plugins,
            onwarn: warning => {
                if (warning.code === 'CIRCULAR_DEPENDENCY')
                    return;
                if (warning.code === 'PREFER_NAMED_EXPORTS')
                    return;
                if (warning.code === 'MIXED_EXPORTS')
                    return;
                if (warning.plugin === 'typescript') {
                    if (warning.message.includes(`your configuration specifies a "module" other than "esnext"`))
                        return;
                    if (warning.message.includes("'#private' is missing in type"))
                        return;
                }
                console.warn(warning.frame, warning.message, warning.code);
            },
        };
        // eslint-disable-next-line no-inner-declarations
        async function emitSource(build, onClose) {
            const outFn = options.dryRun ? 'generate' : 'write';
            const { output } = await build[outFn]({
                file: outFile,
                sourcemap: true,
                sourcemapFile: 'datastore.js.map',
                format: 'cjs',
                generatedCode: 'es2015',
            });
            const [out] = output;
            if (options.watch && resolvable.isResolved) {
                console.log('Reloading Datastore');
                emitter.emit('change', {
                    code: out.code,
                    sourceMap: out.map.toString(),
                });
            }
            const modules = [];
            for (const [module, details] of Object.entries(out.modules)) {
                if (details.renderedLength > 0)
                    modules.push(module);
            }
            resolvable.resolve({
                code: out.code,
                sourceMap: out.map.toString(),
                modules,
                events: emitter,
                close: () => onClose?.(),
            });
        }
        if (!options.watch) {
            const build = await (0, rollup_1.rollup)(config);
            await emitSource(build);
            await build.close();
        }
        else {
            // create a bundle
            const watcher = (0, rollup_1.watch)({
                ...config,
                watch: {
                    skipWrite: true,
                    clearScreen: false,
                    buildDelay: 200,
                },
            });
            watcher.on('event', async (ev) => {
                if (ev.code === 'ERROR') {
                    resolvable.reject(ev.error);
                    await watcher.close();
                }
                if (ev.code === 'BUNDLE_END') {
                    await emitSource(ev.result, watcher.close.bind(watcher));
                }
                if ('result' in ev && ev.result) {
                    await ev.result.close();
                }
            });
        }
    }
    catch (error) {
        if (error.code === 'INVALID_EXPORT_OPTION') {
            // eslint-disable-next-line no-ex-assign
            error = new Error('The Datastore being packaged needs to have a default export that implements the Datastore Specification.');
        }
        resolvable.reject(error);
    }
    return await resolvable.promise;
}
//# sourceMappingURL=rollupDatastore.js.map