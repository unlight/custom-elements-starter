const { rollupConfig } = require('./rollup.config');

module.exports = config => {
    config.set({
        files: [{ pattern: 'dist/bundle.spec.js', type: 'module' }],
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        },
        plugins: [require('@open-wc/karma-esm'), 'karma-*'],
        frameworks: ['esm', 'jasmine', 'source-map-support'],
        // mime: {
        //     'text/x-typescript': ['ts', 'tsx'],
        // },
        esm: {
            nodeResolve: true,
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
        autoWatch: true,
        singleRun: false,
    });

    if (process.argv.includes('--code-coverage') || process.argv.includes('--collectCoverage')) {
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
