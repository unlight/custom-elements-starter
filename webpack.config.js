const path = require('path');
const fs = require('fs');
const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

const defaultOptions = {
    libs: false,
    style: false,
    test: false,
    coverage: false,
    prod: false,
    nomin: false,
    debug: false,
    get dev() {
        return !this.prod;
    },
    get minimize() {
        return !this.nomin;
    },
    get devtool() {
        return 'webpack_devtool' in process.env ? process.env.webpack_devtool : 'cheap-source-map';
    },
    get sourceMap() {
        const devtool = this.devtool;
        return !devtool || devtool === '0' ? false : true;
    },
    get mode() {
        return this.prod ? 'production' : 'development';
    },
};

module.exports = (options = {}, args = {}) => {
    options = { ...defaultOptions, ...options, ...args };
    for (const [key, value] of Object.entries(defaultOptions)) {
        process.stdout.write(`${key}:${value} `);
    }
    const stats = {
        version: false,
        maxModules: 0,
        children: false,
        warningsFilter: [
            /export .* was not found in/,
            /System.import/,
            /Cannot find SourceMap/,
            /Cannot find source file/,
        ],
    };
    if (options.test) {
        Object.assign(stats, {
            timings: false,
            hash: false,
            // builtAt: false,
            assets: false,
            entrypoints: false,
        });
    }
    let config = {
        context: __dirname,
        entry: options.entry,
        output: {
            path: buildPath,
            chunkFilename: `[name]${options.prod ? '-[hash:6]' : ''}.js`,
            filename: `[name]${options.prod ? '-[hash:6]' : ''}.js`,
        },
        mode: options.mode,
        devtool: (() => {
            if (options.test) return 'inline-source-map';
            if (options.prod) return 'source-map';
            return options.devtool;
        })(),
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        devServer: {
            contentBase: [buildPath],
            overlay: false,
            disableHostCheck: true,
            stats: stats,
        },
        stats: stats,
        module: {
            rules: [
                { parser: { amd: false } },
                !options.prod && {
                    test: /\.(js|css)$/,
                    exclude: sourcePath,
                    enforce: 'pre',
                    use: 'source-map-loader',
                },
                {
                    test: (() => {
                        const testTranspileModule = (() => {
                            const transpileModules = [['1-liners', 'module'].join(path.sep)];
                            return file =>
                                Boolean(transpileModules.find(name => name.includes(file)));
                        })();
                        return function testTranspileTypeScript(file) {
                            if (file.slice(-4) === '.tsx') return true;
                            if (file.slice(-3) === '.ts') return true;
                            return testTranspileModule(file);
                        };
                    })(),
                    use: {
                        loader: 'babel-loader',
                        options: {},
                    },
                },
                {
                    test: /\.css$/i,
                    oneOf: [
                        {
                            test: /style\.css$/i,
                            use: [
                                { loader: 'style-loader/url', options: { hmr: false } },
                                {
                                    loader: 'file-loader',
                                    options: {
                                        name: `[name]${options.prod ? '-[hash:6]' : ''}.[ext]`,
                                    },
                                },
                            ],
                        },
                        { use: 'css-loader' },
                    ],
                },
                {
                    test: /\.html$/,
                    use: [{ loader: 'html-loader', options: { minimize: false } }],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|png|jpg|gif|svg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: `i/[name]${options.prod ? '-[hash:6]' : ''}.[ext]`,
                        },
                    },
                },
                options.coverage
                    ? {
                          enforce: 'post',
                          test: /\.tsx?$/,
                          loader: 'istanbul-instrumenter-loader',
                          options: { esModules: true },
                          exclude: [/\.spec\.tsx?$/, /node_modules/, /src[\\/]app[\\/]testing/],
                      }
                    : undefined,
            ].filter(Boolean),
        },

        plugins: [
            (() => {
                const HtmlWebpackPlugin = require('html-webpack-plugin');
                let entryTemplate = undefined;
                if (options.entry && options.entry.includes('src/')) {
                    const resolve = path.resolve(`${path.dirname(options.entry)}/index.html`);
                    entryTemplate = fs.existsSync(resolve) && resolve;
                }
                const settings = {
                    template: entryTemplate,
                    filename: 'index.html',
                    inject: true,
                    config: { ...options },
                };
                if (!settings.template) {
                    delete settings['template'];
                }
                return new HtmlWebpackPlugin(settings);
            })(),
        ].filter(Boolean),

        optimization: {
            namedModules: options.dev || options.debug ? true : false,
            namedChunks: options.dev || options.debug ? true : false,
            minimizer: [
                (options.minimize
                    ? () => {
                          const TerserPlugin = require('terser-webpack-plugin');
                          return new TerserPlugin({
                              terserOptions: {
                                  output: {
                                      comments: false,
                                  },
                              },
                          });
                      }
                    : () => undefined)(),
            ].filter(Boolean),
        },
    };

    return config;
};
