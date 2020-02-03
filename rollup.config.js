const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const html = require('@rollup/plugin-html');
const { typescriptPaths } = require('rollup-plugin-typescript-paths');
const litStyles = require('rollup-plugin-lit-styles');
const globImport = require('rollup-plugin-glob-import');

const env = {
    watch: Boolean(process.env.ROLLUP_WATCH),
    minify: Boolean(process.env.MINIFY),
    production: Boolean(process.env.PRODUCTION),
};
const nodeplugins = [
    commonjs({ include: /node_modules/ }),
    resolve({ extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'] }),
];
const output = {
    dir: 'dist',
    format: 'esm',
    sourcemap: false,
};

exports.default = [
    {
        input: 'lit-element',
        output: output,
        plugins: [...nodeplugins, env.minify && terser()],
    },
    rollupConfig(),
];

exports.rollupConfig = rollupConfig;

function rollupConfig(options) {
    return {
        input: 'src/index.ts',
        treeshake: env.production,
        external: ['tslib', 'lit-element'],
        output: output,
        plugins: [
            ...nodeplugins,
            litStyles({
                postCssPlugins: [],
            }),
            typescript({
                module: 'es2015',
            }),
            typescriptPaths({ absolute: false }),
            {
                name: 'lit-element-rollup-plugin',
                options: options => {
                    // options.external
                    return options;
                },
                // resolveId(source) {
                //     console.log('source', source);
                // },
                // load(id) {
                //     console.log('id1', id);
                // },
                // transform(code, id) {
                //     code = code.replace('lit-element', '/lit-element.js');
                //     code = code.replace('tslib', '/node_modules/tslib/tslib.es6.js');
                //     return { code };
                // },
                // generateBundle(options, bundle, isWrite) {
                //     let code = bundle['index.js'].code;
                //     code = code.replace('lit-element', '/lit-element.js');
                //     code = code.replace('tslib', '/node_modules/tslib/tslib.es6.js');
                //     bundle['index.js'].code = code;
                // },
                // outputOptions(b) {
                //     console.log('b', b);
                // },
            },
            html({
                title: 'lit-element-starter',
            }),
            globImport({ include: '**/spec.module.js' }),
            env.watch &&
                serve({
                    contentBase: ['dist', '.'],
                    historyApiFallback: false,
                    host: 'localhost',
                    port: 8044,
                }),
            env.watch && livereload(),
            env.minify &&
                terser({
                    output: {
                        comments: false,
                    },
                }),
            // {
            //     name: 'debugger',
            //     transform(code, id) {
            //         debugger;
            //         console.log('code', code);
            //     },
            // },
        ],
        ...(options || {}),
    };
}
