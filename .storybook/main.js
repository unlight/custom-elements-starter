module.exports = {
    stories: ['../src/**/*.stories.{ts,js,mdx}', '../src/**/*.story.{ts,js,mdx}'],
    addons: ['@storybook/addon-docs', '@storybook/addon-knobs/register'],
    webpackFinal: async config => {
        const rule = config.module.rules.find(r => {
            return r.use.find && r.use.find(rule => rule.loader === 'babel-loader');
        });
        rule.test = /\.(mjs|[tj]sx?)$/;
        config.resolve.extensions.push('.ts', '.tsx');
        return config;
    },
};
