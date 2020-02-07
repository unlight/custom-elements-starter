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
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
};
