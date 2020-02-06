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
        esm: {
            nodeResolve: true,
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
