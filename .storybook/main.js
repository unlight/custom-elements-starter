module.exports = {
    stories: ['../stories/**/*.stories.{ts,js,mdx}', '../src/**/*.stories.{ts,js,mdx}'],
    webpackFinal: async config => {
        const rule = config.module.rules.find(r => {
            return r.use.find && r.use.find(rule => rule.loader === 'babel-loader');
        });
        rule.test = /\.(mjs|[tj]sx?)$/;
        config.resolve.extensions.push('.ts', '.tsx');
        return config;
    },
    esDevServer: {
        // custom es-dev-server options
    },
};
