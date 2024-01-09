import { build } from 'tsup';

(async function () {
    const sharedOptions = {
        minify: true,
        outDir: '.',
        sourcemap: true,
        bundle: true,
        entry: ['./node.ts', './web.ts'],
        skipNodeModulesBundle: true,
    };

    await build({
        ...sharedOptions,
        format: 'esm',
        outExtension: () => ({ js: '.mjs' }),
    });

    await build({
        ...sharedOptions,
        format: 'cjs',
        outExtension: () => ({ js: '.cjs' }),
    });
})();

