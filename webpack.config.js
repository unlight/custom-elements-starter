const path = require('path');
const fs = require('fs');
const flatten = require('flat');
const sourcePath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'dist');

module.exports = (env = {}, args = {}) => {
    const defaultOptions = {
        watch: false,
        libs: false,
        style: false,
        test: false,
        coverage: false,
        debug: false,
        mode: 'development',
    };
    const options = {
        ...defaultOptions,
        ...args,
        ...env,
        get production() {
            return this.mode === 'production';
        },
        get minimize() {
            return typeof args.minimize === 'boolean' ? args.minimize : this.production;
        },
        get devtool() {
            if (this.test) return 'inline-source-map';
            if (this.production) return 'source-map';
            return 'webpack_devtool' in process.env
                ? process.env.webpack_devtool
                : 'cheap-source-map';
        },
        get sourcemap() {
            return !this.devtool || this.devtool === '0' ? false : true;
        },
    };
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
            assets: false,
            entrypoints: false,
        });
    }
    options.entry = (entry => {
        const glob = require('fast-glob');
        if (entry) {
            [entry] = glob.sync([`src/**/*${entry}*.+(ts|tsx)`, '!**/*.spec.+(ts|tsx)'], {
                absolute: true,
            });
            entry = {
                [path.basename(path.dirname(entry))]: entry,
            };
        } else {
            entry = fs.readdirSync('src').reduce((result, name) => {
                const [file] = glob.sync([`src/${name}/${name}.+(ts|tsx)`, 'src/${name}/index.*'], {
                    absolute: true,
                });
                result[name] = file;
                return result;
            }, {});
        }
        return entry;
    })(options.e || options.entry);

    for (const [key, value] of Object.entries(flatten(options))) {
        process.stdout.write(`${key}:${value} `);
    }

    return {
        externals: {
            // 'lit-element': 'require("lit-element")',
        },
        context: __dirname,
        entry: options.entry,
        output: {
            path: buildPath,
            // chunkFilename: `[name]${options.production ? '-[hash:4]' : ''}.js`,
            // filename: `[name]${options.production ? '-[hash:4]' : ''}.js`,
        },
        mode: options.mode,
        devtool: options.devtool,
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
                !options.production && {
                    test: /\.(js|css)$/,
                    exclude: sourcePath,
                    enforce: 'pre',
                    use: 'source-map-loader',
                },
                {
                    test: (() => {
                        const testTranspileModule = (() => {
                            const transpileModules = ['1-liners/module'].map(x =>
                                x.replace('/', path.sep),
                            );
                            return file =>
                                Boolean(transpileModules.find(name => name.includes(file)));
                        })();
                        return function testTranspileTypeScript(file) {
                            if (file.slice(-4) === '.tsx' || file.slice(-3) === '.ts') {
                                return true;
                            }
                            return testTranspileModule(file);
                        };
                    })(),
                    use: {
                        loader: 'babel-loader',
                        options: {},
                    },
                },
                {
                    test: /\.html$/,
                    use: [{ loader: 'html-loader', options: { minimize: options.minimize } }],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|png|jpg|gif|svg)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: `i/[name]${options.production ? '-[hash:4]' : ''}.[ext]`,
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
            (options.watch
                ? () => {
                      const HtmlWebpackPlugin = require('html-webpack-plugin');
                      let entryTemplate = undefined;
                      const entry =
                          Object.keys(options.entry).length === 1 &&
                          Object.values(options.entry)[0];
                      if (entry && entry.includes('src/')) {
                          const resolve = path.resolve(`${path.dirname(entry)}/index.html`);
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
                  }
                : () => undefined)(),
        ].filter(Boolean),

        optimization: {
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
};
