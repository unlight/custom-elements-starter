import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import serve from 'rollup-plugin-serve';
// import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;
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
        input: 'tslib',
        output: output,
        plugins: [...nodeplugins],
    },
    {
        input: 'lit-element',
        output: output,
        plugins: [...nodeplugins],
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
            // copy({
            //     targets: [
            //         { src: './src/index.html', dest: outputDir },
            //         // { src: './node_modules/@webcomponents/webcomponentsjs/bundles/', dest: outputDir },
            //         // {
            //         //   src: './node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
            //         //   dest: outputDir
            //         // }
            //     ],
            // }),
            // filesize(),
            // !production &&
            //     serve({
            //         contentBase: [outputDir],
            //         open: true,
            //         host: 'localhost',
            //         port: 10000,
            //     }),
            // production && terser(),
        ],
    },
];
