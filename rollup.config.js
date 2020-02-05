const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const serve = require('rollup-plugin-serve');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');
const typescript = require('@rollup/plugin-typescript');
const html = require('@rollup/plugin-html');
const { typescriptPaths } = require('rollup-plugin-typescript-paths');
const litStyles = require('rollup-plugin-lit-styles');
const multi = require('@rollup/plugin-multi-entry');
const esmImportToUrl = require('rollup-plugin-esm-import-to-url');

const env = {
    watch: Boolean(process.env.ROLLUP_WATCH),
    minify: Boolean(process.env.MINIFY),
    production: Boolean(process.env.PRODUCTION),
    test: Boolean(process.env.TEST),
    libs: Boolean(process.env.LIBS),
};

const nodePlugins = [
    commonjs({ include: /node_modules/ }),
    resolve({ extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'] }),
];

const output = {
    dir: 'dist',
    format: 'esm',
    sourcemap: false,
};

module.exports = rollupConfig(env);

function rollupConfig(env) {
    const options = {};

    const input = 'src/index.ts';
    const external = [];
    const plugins = [
        ...nodePlugins,
        litStyles({
            postCssPlugins: [],
        }),
        typescript({
            module: 'es2015',
            noEmitOnError: false,
        }),
        typescriptPaths({ absolute: false }),
        {
            name: 'lit-element-rollup-plugin',
            options: options => {
                // options.external
                return options;
            },
        },
        !env.test &&
            html({
                title: 'lit-element-starter',
            }),
        env.watch &&
            !env.test &&
            serve({
                contentBase: ['dist', '.'],
                historyApiFallback: false,
                host: 'localhost',
                port: 8044,
            }),
        env.watch && !env.test && livereload(),
        env.minify &&
            terser({
                output: {
                    comments: false,
                },
            }),
    ];

    if (env.libs) {
        options.input = 'lit-element';
        options.external = [];
    } else {
        plugins.unshift(
            esmImportToUrl({
                imports: {
                    tslib: 'http://localhost:8044/node_modules/tslib/tslib.es6.js',
                    'lit-element': 'http://localhost:8044/lit-element.js',
                },
            }),
        );
    }

    if (env.test) {
        options.input = 'src/**/*.spec.ts';
        customPlugins.unshift(multi());
        options.output = {
            ...output,
            file: 'dist/bundle.spec.js',
            dir: undefined,
            sourcemap: 'inline',
        };
    }

    return {
        input: input,
        treeshake: env.production,
        external: external,
        output: output,
        plugins: plugins,
        ...options,
    };
}
