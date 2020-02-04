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

const env = {
    watch: Boolean(process.env.ROLLUP_WATCH),
    minify: Boolean(process.env.MINIFY),
    production: Boolean(process.env.PRODUCTION),
    test: Boolean(process.env.TEST),
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

exports.default = [
    {
        input: 'lit-element',
        output: output,
        plugins: [...nodePlugins, env.minify && terser()],
    },
    rollupConfig(env),
];

exports.rollupConfig = rollupConfig;

function rollupConfig(env) {
    const customPlugins = [];
    const customOptions = {};

    if (env.test) {
        customOptions.input = 'src/**/*.spec.ts';
        customPlugins.push(multi());
        customOptions.output = {
            ...output,
            file: 'dist/bundle.spec.js',
            dir: undefined,
            sourcemap: 'inline',
        };
    }

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
        // {
        //     name: 'debugger',
        //     transform(code, id) {
        //         debugger;
        //         console.log('code', code);
        //     },
        // },
        ...customPlugins,
    ];

    return {
        input: 'src/index.ts',
        treeshake: env.production,
        external: ['tslib', 'lit-element'],
        output: output,
        plugins: plugins,
        ...customOptions,
    };
}
