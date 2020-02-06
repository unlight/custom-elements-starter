const { rollupConfig } = require('./rollup.config');

module.exports = config => {
    config.set({
        files: [{ pattern: 'src/**/*.spec.ts', type: 'module' }],
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-setuid-sandbox'],
            },
        },
        plugins: [require('@open-wc/karma-esm'), 'karma-*'],
        frameworks: ['esm', 'jasmine', 'source-map-support'],
        esm: {
            nodeResolve: true,
            babel: true,
            fileExtensions: ['.ts', '.tsx'],
        },
        reporters: ['progress'],
        restartOnFileChange: true,
        client: {
            captureConsole: true,
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        colors: true,
        logLevel: config.LOG_INFO,
        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly', 'text'],
            dir: 'coverage',
            combineBrowserReports: true,
            skipFilesWithNoCoverage: false,
            instrumentation: {
                'es-modules': true,
                'default-excludes': true,
                excludes: ['**/*.spec.{ts,js}', '**/*.{scss,css}'],
            },
        },
        autoWatch: true,
        singleRun: false,
        mime: {
            'text/x-typescript': ['ts', 'tsx'],
        },
        preprocessors: {
            '**/*.spec.js': ['rollup'],
        },
        rollupPreprocessor: rollupConfig({ test: true }),
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
