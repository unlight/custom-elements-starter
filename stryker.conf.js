module.exports = function(config) {
    config.set({
        mutator: 'typescript',
        packageManager: 'npm',
        reporters: ['html', 'clear-text', 'progress', 'dashboard'],
        testRunner: 'karma',
        transpilers: [],
        testFramework: 'jasmine',
        coverageAnalysis: 'off',
        karma: {
            projectType: 'custom',
            configFile: 'karma.conf.js',
            config: {},
        },
        tsconfigFile: 'tsconfig.json',
        mutate: ['src/**/*.tsx', 'src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.spec.tsx'],
        maxConcurrentTestRunners: 2,
        babel: {
            optionsFile: 'babel.config.js',
        },
        htmlReporter: {
            baseDir: 'coverage/mutation',
        },
    });
};
