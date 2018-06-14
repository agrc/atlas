require({
    baseUrl: '../node_modules/',
    packages: [
        'dojo',
        'dijit',
        'moment',
        'dojox',
        {
            name: 'app',
            location: '../src/app'
        },
        {
            name: 'dart-board',
            location: '@agrc/dart-board'
        },
        {
            name: 'bootstrap',
            location: 'bootstrap',
            main: 'dist/js/bootstrap'
        }, {
            name: 'jquery',
            location: 'jquery/dist',
            main: 'jquery'
        }, {
            name: 'proj4',
            location: 'proj4/dist',
            main: 'proj4'
        }, {
            name: 'layer-selector',
            location: '@agrc/layer-selector'
        }, {
            name: 'helpers',
            location: '@agrc/helpers'
        }, {
            name: 'map-tools',
            location: '@agrc/map-tools'
        }, {
            name: 'sherlock',
            location: '@agrc/sherlock'
        }, {
            name: 'spinjs',
            location: 'spin.js'
        },
        // required for esri js api
        {
            name: 'esri',
            location: 'arcgis-js-api'
        }, {
            name: '@dojo',
            location: '@dojo'
        }, {
            name: 'cldrjs',
            location: 'cldrjs',
            main: 'dist/cldr'
        }, {
            name: 'globalize',
            location: 'globalize',
            main: 'dist/globalize'
        }, {
            name: 'maquette',
            location: 'maquette',
            main: 'dist/maquette.umd'
        }, {
            name: 'maquette-css-transitions',
            location: 'maquette-css-transitions',
            main: 'dist/maquette-css-transitions.umd'
        }, {
            name: 'maquette-jsx',
            location: 'maquette-jsx',
            main: 'dist/maquette-jsx.umd'
        }, {
            name: 'tslib',
            location: 'tslib',
            main: 'tslib'
        }
    ]
});
