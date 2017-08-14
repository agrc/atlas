/* eslint-disable no-unused-vars */
var profile = {
    basePath: '../src',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: false,
    layerOptimize: false,
    selectorEngine: 'acme',
    layers: {
        'dojo/dojo': {
            include: [
                'app/App',
                'app/packages',
                'app/run',
                'dojo/domReady',
                'dojo/i18n',
                'dojox/gfx/filters',
                'dojox/gfx/path',
                'dojox/gfx/shape',
                'dojox/gfx/svg',
                'dojox/gfx/svgext'
            ],
            includeLocales: ['en-us'],
            customBase: true,
            boot: true
        }
    },
    packages: [{
        name: 'agrc',
        resourceTags: {
            miniExclude: function miniExclude(filename, mid) {
                return mid !== 'agrc/modules/WebAPI';
            }
        }
    }, {
        name: 'proj4',
        trees: [
            // don't bother with .hidden, tests, min, src, and templates
            ['.', '.', /(\/\.)|(~$)|(test|txt|src|min|html)/]
        ],
        resourceTags: {
            amd: function amd() {
                return true;
            },
            copyOnly: function copyOnly() {
                return false;
            }
        }
    }, {
        name: 'moment',
        location: 'moment',
        main: 'moment',
        trees: [
            // don't bother with .hidden, tests, min, src, and templates
            ['.', '.', /(\/\.)|(~$)|(test|txt|src|min|templates)/]
        ],
        resourceTags: {
            amd: function amd(filename, mid) {
                return /\.js$/.test(filename);
            }
        }
    }],
    staticHasFeatures: {
        // The trace & log APIs are used for debugging the loader, so we don’t need them in the build
        'dojo-trace-api': 0,
        'dojo-log-api': 0,

        // This causes normally private loader data to be exposed for debugging, so we don’t need that either
        'dojo-publish-privates': 0,

        // We’re fully async, so get rid of the legacy loader
        'dojo-sync-loader': 0,

        // dojo-xhr-factory relies on dojo-sync-loader
        'dojo-xhr-factory': 0,

        // We aren’t loading tests in production
        'dojo-test-sniff': 0,

        // ie 11 support
        'dojo-guarantee-console': 1,
        'console-as-object': 0
    },
    userConfig: {
        packages: ['app', 'dijit', 'dojox', 'agrc', 'ijit', 'esri', 'layer-selector', 'sherlock']
    }
};
