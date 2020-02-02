import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import html from '@rollup/plugin-html';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';

const env = {
    watch: Boolean(process.env.ROLLUP_WATCH),
    minify: Boolean(process.env.MINIFY),
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

export default [
    {
        input: 'lit-element',
        output: output,
        plugins: [...nodeplugins, env.minify && terser()],
    },
    {
        input: 'src/index.ts',
        // treeshake: production,
        external: ['tslib', 'lit-element'],
        output: output,
        plugins: [
            ...nodeplugins,
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
                generateBundle(options, bundle, isWrite) {
                    let code = bundle['index.js'].code;
                    code = code.replace('lit-element', '/lit-element.js');
                    code = code.replace('tslib', '/node_modules/tslib/tslib.es6.js');
                    bundle['index.js'].code = code;
                },
                // outputOptions(b) {
                //     console.log('b', b);
                // },
            },
            html({
                title: 'lit-element-starter',
            }),
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
    },
];
