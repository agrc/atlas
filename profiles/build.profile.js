/* eslint-disable no-magic-numbers, no-unused-vars */

/**
 * Based on the dojo-boilerplate
 * https://github.com/csnover/dojo-boilerplate
 * and https://github.com/Esri/jsapi-resources/blob/master/4.x/bower/dojo/build.profile.js
 *
 * Please refer to the Dojo Build tutorial for more details
 * http://dojotoolkit.org/documentation/tutorials/1.10/build/
 * Look to `util/build/buildControlDefault.js` for more information on available options and their default values.
 */
var profile = {
    optimizeOptions: {
        languageIn: 'ECMASCRIPT5'
    },

    // `basePath` is relative to the directory containing this profile file; in this case, it is being set to the
    // src/ directory, which is the same place as the `baseUrl` directory in the loader configuration.
    basePath: '../src',

    action: 'release',

    // closure compiler
    // optimize: 'closure', // requires Java 6 or later: http://code.google.com/p/closure-compiler/wiki/FAQ
    // layerOptimize: 'closure',

    optimize: false,
    // layerOptimize: 'closure',
    layerOptimize: false,

    useSourceMaps: false,
    cssOptimize: 'comments',
    copyTests: false,
    internStrings: true,
    mini: true,

    // The default selector engine is not included by default in a dojo.js build in order to make mobile builds
    // smaller. We add it back here to avoid that extra HTTP request. There is also an 'acme' selector available; if
    // you use that, you will need to set the `selectorEngine` property in index.html, too.
    selectorEngine: 'lite',
    // Strips all calls to console functions within the code. You can also set this to 'warn' to strip everything
    // but console.error, and any other truthy value to strip everything but console.warn and console.error.
    // This defaults to 'normal' (strip all but warn and error) if not provided.
    stripConsole: 'none',

    // dojoBootText: 'require.boot && require.apply(null, require.boot);',
    insertAbsMids: 0,
    // If present and truthy, instructs the loader to consume the cache of layer member modules
    noref: true,

    // A list of packages that will be built. The same packages defined in the loader should be defined
    // here in the build profile.
    packages: ['app', {
        name: 'dart-board',
        location: '../node_modules/@agrc/dart-board'
    }, {
        name: 'bootstrap',
        location: '../node_modules/bootstrap',
        main: 'dist/js/bootstrap'
    }, {
        name: 'jquery',
        location: '../node_modules/jquery/dist',
        main: 'jquery'
    }, {
        name: 'proj4',
        location: '../node_modules/proj4/dist',
        main: 'proj4'
    }, {
        name: 'layer-selector',
        location: '../node_modules/@agrc/layer-selector'
    }, {
        name: 'helpers',
        location: '../node_modules/@agrc/helpers'
    }, {
        name: 'sherlock',
        location: '../node_modules/@agrc/sherlock'
    }, {
        name: 'map-tools',
        location: '../node_modules/@agrc/map-tools'
    }, {
        name: 'spinjs',
        location: '../node_modules/spin.js',
        resourceTags: {
            miniExclude: function miniExclude(filename, mid) {
                return mid !== 'spinjs/spin';
            }
        }
    }, {
        name: 'dijit',
        location: '../node_modules/dijit',
        trees: [
            // don't bother with .hidden, tests, min, src, and templates
            ['.', '.', /(\/\.)|(~$)|(test|node_modules)/]
        ]
    }, {
        name: 'dojo',
        location: '../node_modules/dojo',
        trees: [
            // don't bother with .hidden, tests, min, src, and templates
            ['.', '.', /(\/\.)|(~$)|(test|node_modules)/]
        ]
    }, {
        name: 'dojox',
        location: '../node_modules/dojox'
    }, {
        name: 'dstore',
        location: '../node_modules/dojo-dstore',
        trees: [
            // don't bother with .hidden, tests, min, src, and templates
            ['.', '.', /(\/\.)|(~$)|(test|txt|src|min|templates|node_modules)/]
        ]
    }, {
        name: 'dgrid',
        location: '../node_modules/dgrid',
        trees: [
            // don't bother with .hidden, tests, min, src, and templates
            ['.', '.', /(\/\.)|(~$)|(test|node_modules)/]
        ]
    }, {
        name: 'esri',
        location: '../node_modules/arcgis-js-api'
    }, {
        name: 'moment',
        location: '../node_modules/moment',
        main: 'moment',
        trees: [
            ['.', '.', /(\/\.)|(~$)|(test|txt|src|min|templates)/]
        ],
        resourceTags: {
            amd: function(filename, mid) { // eslint-disable-line
                return /\.js$/.test(filename);
            }
        }
    }, {
        name: '@dojo',
        location: '../node_modules/@dojo',
        resourceTags: {
            miniExclude: function (filename, mid) {
                if (filename.slice(-4) === '.mjs') {
                    return true;
                }

                return [
                    '@dojo/core/request/providers/node',
                    '@dojo/shim/browser', // requires pepjs and intersection-observer
                    '@dojo/shim/util/amd'
                ].indexOf(mid) > -1;
            }
        }
    }, {
        name: 'cldrjs',
        location: '../node_modules/cldrjs',
        main: 'dist/cldr',
        resourceTags: {
            miniExclude: function (filename, mid) {
                return mid.indexOf('/node_main') > -1 ||
                    mid.indexOf('/doc/') > -1;
            }
        }
    }, {
        name: 'globalize',
        location: '../node_modules/globalize',
        main: 'dist/globalize',
        resourceTags: {
            miniExclude: function (filename, mid) {
                return mid.indexOf('/CONTRIBUTING') > -1 ||
                    mid.indexOf('/node-main') > -1 ||
                    mid.indexOf('/doc/') > -1 ||
                    mid.indexOf('/examples/') > -1;
            }
        }
    }, {
        name: 'maquette',
        location: '../node_modules/maquette',
        main: 'dist/maquette.umd',
        resourceTags: {
            miniExclude: function (filename, mid) {
                return mid.indexOf('/polyfills/') > -1 ||
                    mid.indexOf('/dist/') > -1 && filename.indexOf('.umd.js') === -1;
            }
        }
    }, {
        name: 'maquette-jsx',
        location: '../node_modules/maquette-jsx',
        main: 'dist/maquette-jsx.umd',
        resourceTags: {
            miniExclude: function (filename, mid) {
                return mid.indexOf('/dist/') > -1 && filename.indexOf('.umd.js') === -1;
            }
        }
    }, {
        name: 'maquette-css-transitions',
        location: '../node_modules/maquette-css-transitions',
        main: 'dist/maquette-css-transitions.umd',
        resourceTags: {
            miniExclude: function (filename, mid) {
                return mid.indexOf('/dist/') > -1 && filename.indexOf('.umd.js') === -1;
            }
        }
    }, {
        name: 'tslib',
        location: '../node_modules/tslib',
        main: 'tslib',
        resourceTags: {
            miniExclude: function (filename, mid) {
                return mid.indexOf('/tslib.es6') > -1 ||
                    mid.indexOf('/tslib.html') > -1 ||
                    mid.indexOf('/docs/') > -1;
            }
        }
    }],

    // Any module in an application can be converted into a 'layer' module, which consists of the original module +
    // additional dependencies built into the same file. Using layers allows applications to reduce the number of HTTP
    // requests by combining all JavaScript into a single file.
    layers: {
        // This is the main loader module. It is a little special because it is treated like an AMD module even though
        // it is actually just plain JavaScript. There is some extra magic in the build system specifically for this
        // module ID.
        'dojo/dojo': {
            // By default, the build system will try to include `dojo/main` in the built `dojo/dojo` layer, which adds
            // a bunch of stuff we do not want or need. We want the initial script load to be as small and quick to
            // load as possible, so we configure it as a custom, bootable base.
            boot: true,
            customBase: true,
            targetStylesheet: 'app/css/main.css',
            include: [
                'dojo/domReady',
                // include the app, set accordingly for your application
                'app/App',
                'app/run',

                /** enforce some modules loading */
                /** not included because dom is -1 */
                'dojo/_base/browser',
                'esri/core/request/script',

                'dojox/gfx',
                'dojox/gfx/renderer',
                'dojox/gfx/svg',

                'esri/core/colorUtils',
                'esri/core/geolocationUtils',

                // esri identity
                'esri/identity/IdentityManager',

                // esri portal
                'esri/portal/support/layersCreator',

                // esri map
                'esri/Map',
                'esri/views/MapView',
                'esri/layers/VectorTileLayer',
                'esri/views/vectorTiles/WorkerTileHandler',
                'esri/layers/GroupLayer',
                'esri/layers/FeatureLayer',
                'esri/layers/graphics/sources/FeatureLayerSource',
                'esri/layers/graphics/controllers/AutoController2D',
                'esri/layers/graphics/controllers/OnDemandController2D',
                'esri/layers/graphics/controllers/SnapshotController',
                'esri/layers/support/arcgisLayers',
                'esri/layers/TileLayer',
                'esri/views/2d/layers/GraphicsLayerView2D',
                'esri/views/2d/layers/FeatureLayerView2D',
                'esri/views/2d/layers/TiledLayerView2D',
                'esri/views/2d/layers/VectorTileLayerView2D',
                'esri/views/layers/GroupLayerView',

                'esri/WebMap',

                'esri/widgets/Expand',
                'esri/widgets/Legend',
                'esri/widgets/Home',
                'esri/widgets/Locate',
                'esri/widgets/Fullscreen',
                'esri/widgets/BasemapToggle',
                'esri/widgets/Print',
                'esri/widgets/Search',
                'esri/widgets/Widget',
                'esri/widgets/support/widget',

                'esri/core/workers/RemoteClient',
                'esri/core/workers/request'
            ],
            // You can define the locale for your application if you like
            includeLocales: ['en-us']
        }
    },

    // Providing hints to the build system allows code to be conditionally removed on a more granular level than simple
    // module dependencies can allow. This is especially useful for creating tiny mobile builds. Keep in mind that dead
    // code removal only happens in minifiers that support it! Currently, only Closure Compiler to the Dojo build system
    // with dead code removal. A documented list of has-flags in use within the toolkit can be found at
    // <http://dojotoolkit.org/reference-guide/dojo/has.html>.
    // these are all the has feature that affect the loader and/or the bootstrap
    // the settings below are optimized for the smallest AMD loader that is configurable
    // and include dom-ready support
    staticHasFeatures: {
        'config-dojo-loader-catches': 0,
        'config-tlmSiblingOfDojo': 0,
        'dojo-amd-factory-scan': 0,
        'dojo-combo-api': 0,
        'dojo-config-api': 1,
        'dojo-config-require': 0,
        'dojo-debug-messages': 0,
        'dojo-dom-ready-api': 1,
        'dojo-firebug': 0,
        'dojo-guarantee-console': 1,

        // https://dojotoolkit.org/documentation/tutorials/1.10/device_optimized_builds/index.html
        // https://dojotoolkit.org/reference-guide/1.10/dojo/has.html
        'dom-addeventlistener': 1,
        'dom-qsa': 1,
        'dom-qsa2.1': 1,
        'dom-qsa3': 1,
        'dom-matches-selector': 1,
        'json-stringify': 1,
        'json-parse': 1,
        'bug-for-in-skips-shadowed': 0,
        'native-xhr': 1,
        'native-xhr2': 1,
        'native-formdata': 1,
        'native-response-type': 1,
        'native-xhr2-blob': 1,
        'dom-parser': 1,
        activex: 0,
        'script-readystatechange': 1,
        'ie-event-behavior': 0,
        MSPointer: 0,
        'touch-action': 1,
        'dom-quirks': 0,
        'array-extensible': 1,
        'console-as-object': 1,
        jscript: 0,
        'event-focusin': 1,
        'events-mouseenter': 1,
        'events-mousewheel': 1,
        'event-orientationchange': 1,
        'event-stopimmediatepropagation': 1,
        'touch-can-modify-event-delegate': 0,
        'dom-textContent': 1,
        'dom-attributes-explicit': 1,

        // unsupported browsers
        air: 0,
        wp: 0,
        khtml: 0,
        wii: 0,
        quirks: 0,
        bb: 0,
        msapp: 0,
        opr: 0,
        android: 0,

        svg: 1,

        // Deferred Instrumentation is disabled by default in the built version
        // of the API but we still want to enable users to activate it.
        // Set to -1 so the flag is not removed from the built version.
        'config-deferredInstrumentation': -1,

        // Dojo loader will have 'has' api, but other loaders such as
        // RequireJS do not. So, let's not mark it static.
        // This will allow RequireJS loader to fetch our modules.
        'dojo-has-api': -1,

        'dojo-inject-api': 1,
        'dojo-loader': 1,
        'dojo-log-api': 0,
        'dojo-modulePaths': 0,
        'dojo-moduleUrl': 0,
        'dojo-publish-privates': 0,
        'dojo-requirejs-api': 0,
        'dojo-sniff': 0,
        'dojo-sync-loader': 0,
        'dojo-test-sniff': 0,
        'dojo-timeout-api': 0,
        'dojo-trace-api': 0,
        // 'dojo-undef-api': 0,
        'dojo-v1x-i18n-Api': 1, // we still need i18n.getLocalization
        'dojo-preload-i18n-Api': 0, // added this because built version was failing on some i18n code
        'dojo-xhr-factory': 0,
        dom: -1,
        'host-browser': -1,
        'extend-dojo': 1,
        'extend-esri': 0,

        'esri-webpack': 0
    },

    map: {
        globalize: {
            cldr: 'cldrjs/dist/cldr',
            'cldr/event': 'cldrjs/dist/cldr/event',
            'cldr/supplemental': 'cldrjs/dist/cldr/supplemental',
            'cldr/unresolved': 'cldrjs/dist/cldr/unresolved'
        }
    },

    // no additional user config required
    userConfig: {},

    // configure dojo in the build layer
    // no dojo config required in the app
    // note: packages must be relative to ./ directory and build will resolve paths
    defaultConfig: {
        baseUrl: 'dojo',
        async: 1,
        hasCache: {
            // these are the values given above, not-built client code may test for these so they need to be available
            'dojo-built': 1,
            'dojo-loader': 1,
            'dojo-undef-api': 0,
            dom: 1,
            'host-browser': 1,

            // Disable deferred instrumentation by default in the built version.
            'config-deferredInstrumentation': 0,

            // Dojo loader has built-in 'has' api. Since dojoConfig is used
            // by Dojo loader, we can set the default here.
            'dojo-has-api': 1,

            // default
            'config-selectorEngine': 'lite',

            'esri-featurelayer-webgl': 1,

            'esri-promise-compatibility': 0,
            'esri-promise-compatibility-deprecation-warnings': 1
        },
        map: {
            globalize: {
                cldr: 'cldrjs/dist/cldr',
                'cldr/event': 'cldrjs/dist/cldr/event',
                'cldr/supplemental': 'cldrjs/dist/cldr/supplemental',
                'cldr/unresolved': 'cldrjs/dist/cldr/unresolved'
            }
        },
        aliases: [
            [
                /^webgl-engine/,
                function () {
                    return 'esri/views/3d/webgl-engine';
                }
            ],
            [
                /^engine/,
                function () {
                    return 'esri/views/3d/webgl-engine';
                }
            ],
            [
                /^esri-hydra/,
                function () {
                    return 'esri';
                }
            ]
        ],
        packages: [{
            name: 'app',
            location: 'app',
            main: 'main'
        }, {
            name: 'esri',
            location: 'esri'
        }, {
            name: 'dojo',
            location: 'dojo'
        }, {
            name: 'dijit',
            location: 'dijit'
        }, {
            name: 'dojox',
            location: 'dojox'
        }, {
            name: 'dstore',
            location: 'dstore'
        }, {
            name: 'dgrid',
            location: 'dgrid'
        }, {
            name: 'moment',
            location: 'moment',
            main: 'moment'
        }]
    }
};
