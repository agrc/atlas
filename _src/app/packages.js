require({
    packages: [
        'agrc',
        'app',
        'dart-board',
        'dgrid',
        'dijit',
        'dojo',
        'dojox',
        'dstore',
        'esri',
        'layer-selector',
        'map-tools',
        'moment',
        'sherlock',
        'spinjs',
        {
            name: 'bootstrap',
            location: './bootstrap',
            main: 'dist/js/bootstrap'
        }, {
            name: 'jquery',
            location: './jquery/dist',
            main: 'jquery'
        }, {
            name: 'proj4',
            location: './proj4/dist',
            main: 'proj4'
        }, {
            name: 'spin',
            location: './spinjs',
            main: 'spin'
        }
    ],
    map: {
        '*': {
            spinjs: 'spin'
        }
    }
});
