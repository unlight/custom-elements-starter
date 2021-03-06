module.exports = {
    presets: [
        [
            '@babel/preset-typescript',
            {
                isTSX: true,
                allExtensions: true,
                jsxPragma: 'h',
            },
        ],
        [
            '@babel/preset-env',
            {
                targets: {
                    esmodules: true,
                },
                loose: true,
            },
        ],
    ],
    plugins: [
        ['@babel/plugin-transform-react-jsx', {}],
        ['babel-plugin-postcss', { test: /\.css$/, tagged: undefined, postcss: true }],
        [
            'babel-plugin-inline-import',
            {
                extensions: ['.html'],
            },
        ],
        ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};
