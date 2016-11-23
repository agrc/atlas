/* global JasmineFaviconReporter, jasmineRequire */
var dojoConfig = {  // eslint-disable-line no-unused-vars
    baseUrl: '/src/',
    // dojo is required here since we are defining baseUrl before loading dojo
    packages: ['dojo',
        {
            name: 'agrc-jasmine-matchers',
            location: 'agrc-jasmine-matchers/src'
        }, {
            name: 'stubmodule',
            location: 'stubmodule/src',
            main: 'stub-module'
        }
    ],
    has: {
        'dojo-undef-api': true
    }
};

// for jasmine-favicon-reporter
jasmine.getEnv().addReporter(new JasmineFaviconReporter());
jasmine.getEnv().addReporter(new jasmineRequire.JSReporter2());
