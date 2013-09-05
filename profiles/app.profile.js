/*jshint unused:false */
var profile = {
    basePath: '../src',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: 'closure',
    layerOptimize: 'closure',
    stripConsole: 'all',
    selectorEngine: 'acme',
    layers: {
        'dojo/dojo': {
            include: [
                'dojo/i18n',
                'dojo/domReady',
                'app/main',
                'app/run',
                'esri/dijit/Attribution'
            ],
            customBase: true,
            boot: true
        }
    },
    staticHasFeatures: {
        // The trace & log APIs are used for debugging the loader, so we don’t need them in the build
        'dojo-trace-api':0,
        'dojo-log-api':0,

        // This causes normally private loader data to be exposed for debugging, so we don’t need that either
        'dojo-publish-privates':0,

        // We’re fully async, so get rid of the legacy loader
        'dojo-sync-loader':0,
        
        // dojo-xhr-factory relies on dojo-sync-loader
        'dojo-xhr-factory':0,

        // We aren’t loading tests in production
        'dojo-test-sniff':0
    },
    packages: [{
        name: 'dojo',
        location: 'dojo'
    },{
        name: 'dijit',
        location: 'dijit'
    },{
        name: 'dojox',
        location: 'dojox'
    },{
        name: 'esri',
        location: 'esri',
        resourceTags: {
            amd: function (filename, mid) {
                return (/.*\.js/).test(filename);
            }
        }
    }],
    plugins: {
        'agrc/modules/JSONLoader': 'agrc/modules/JSONLoaderBuildPlugin'
    }
};