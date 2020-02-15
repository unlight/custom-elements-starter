const webpackConfig = require('./webpack.config');

module.exports = config => {
    const webpackOptions = { test: true, coverage: false };
    const files = [{ pattern: 'src/**/*.spec.+(ts|tsx)' }];

    config.set({
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        },
        preprocessors: {
            '**/*.+(ts|tsx)': ['webpack'],
        },
        plugins: ['karma-*'],
        frameworks: ['jasmine', 'source-map-support'],
        reporters: ['progress'],
        client: {
            captureConsole: true,
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        mime: {
            'text/x-typescript': ['ts', 'tsx'],
        },
    });

    if (process.argv.includes('--code-coverage') || process.argv.includes('--collectCoverage')) {
        webpackOptions.coverage = true;
        config.set({
            reporters: ['mocha', 'coverage-istanbul'],
            mochaReporter: {
                symbols: {
                    success: '+',
                    info: '#',
                    warning: '!',
                    error: 'x',
                },
            },
            coverageIstanbulReporter: {
                reports: ['text', 'html'],
                fixWebpackSourcePaths: true,
                skipFilesWithNoCoverage: false,
                'report-config': {
                    text: null,
                },
            },
        });
    }

    const webpackConfiguration = webpackConfig(webpackOptions);

    config.set({
        files: files,
        webpack: webpackConfiguration,
        webpackMiddleware: {
            stats: webpackConfiguration.stats,
        },
    });
};
