/* global JasmineFaviconReporter, jasmineRequire */
/*jshint unused:false*/
require({
    packages: [{
        name: 'agrc-jasmine-matchers',
        location: 'agrc-jasmine-matchers/src'
    }, {
        name: 'stubmodule',
        location: 'stubmodule/src',
        main: 'stub-module'
    }],
    baseUrl: '/src/'
});

// for jasmine-favicon-reporter
jasmine.getEnv().addReporter(new JasmineFaviconReporter());
jasmine.getEnv().addReporter(new jasmineRequire.JSReporter2());
