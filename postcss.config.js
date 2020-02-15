module.exports = context => {
    // context.env ~ NODE_ENV
    const production = context.env === 'production';
    return {
        plugins: [production && require('cssnano')()].filter(Boolean),
    };
};
