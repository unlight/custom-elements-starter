module.exports = {
    presets: [
        '@babel/preset-typescript',
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
        ['babel-plugin-postcss', { test: /\.css$/, tagged: ['css', 'lit-element'] }],
        ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};
