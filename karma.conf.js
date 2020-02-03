const { rollupConfig } = require('./rollup.config');

module.exports = config => {
    config.set({
        files: [],
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        },
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage-istanbul-reporter'),
            require('@open-wc/karma-esm'),
            require('karma-source-map-support'),
            require('karma-mocha-reporter'),
            'karma-*',
        ],
        frameworks: ['esm', 'jasmine', 'source-map-support'],
        esm: {
            // coverage,
            // compatibility,
            // // prevent compiling es5 libs
            // babelExclude: [
            //     '**/node_modules/mocha/**/*',
            //     '**/node_modules/chai/**/*',
            //     '**/node_modules/sinon-chai/**/*',
            //     '**/node_modules/chai-dom/**/*',
            //     '**/node_modules/core-js-bundle/**/*',
            // ],
            // sinon is not completely es5...
            // babelModernExclude: ['**/node_modules/sinon/**/*'],
            // prevent compiling non-module libs
            // babelModuleExclude: ['**/node_modules/mocha/**/*', '**/node_modules/core-js-bundle/**/*'],
            // polyfills: {
            //     webcomponents: true,
            //     fetch: true,
            // },
            // exclude: ['**/__snapshots__/**/*'],
        },
        // preprocessors: {
        //     '**/__snapshots__/**/*.md': ['snapshot'],
        // },
        reporters: ['progress'],
        // reporters: coverage ? ['mocha', 'coverage-istanbul'] : ['mocha'],
        // mochaReporter: {
        //     showDiff: true,
        // },
        restartOnFileChange: true,
        client: {
            captureConsole: true,
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        colors: true,
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,
        // ## code coverage config
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text'],
            dir: 'coverage',
            combineBrowserReports: true,
            skipFilesWithNoCoverage: false,
        },
        // snapshot: {
        //     update: updateSnapshots,
        //     prune: pruneSnapshots,
        //     // only warn about unused snapshots when running all tests
        //     limitUnusedSnapshotsInWarning: config.grep ? 0 : -1,
        //     pathResolver(basePath, suiteName) {
        //         return `${basePath}/__snapshots__/${suiteName}.md`;
        //     },
        // },
        autoWatch: false,
        singleRun: false,
        concurrency: Infinity,
    });

    if (process.argv.includes('--code-coverage') || process.argv.includes('--coverage')) {
        config.set({
            reporters: ['mocha', 'coverage-istanbul'],
            esm: {
                coverage: true,
            },
            mochaReporter: {
                symbols: {
                    success: '+',
                    info: '#',
                    warning: '!',
                    error: 'x',
                },
            },
        });
    }
};
