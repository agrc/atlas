(function () {
    // the baseUrl is relavant in source version and while running unit tests.
    // the`typeof` is for when this file is passed as a require argument to the build system
    // since it runs on node, it doesn't have a window object. The basePath for the build system
    // is defined in build.profile.js
    var config = {
        baseUrl: (
            typeof window !== 'undefined' &&
            window.dojoConfig &&
            window.dojoConfig.isJasmineTestRunner
            ) ? '/src': './',
        packages: [
            'agrc',
            'app',
            'dijit',
            'dojo',
            'dojox',
            'esri',
            'ijit',
            {
                name: 'proj4',
                location: './proj4js',
                main: 'proj4'
            },{
                name: 'jquery',
                location: './jquery/dist',
                main: 'jquery'
            },{
                name: 'bootstrap',
                location: './bootstrap',
                main: 'dist/js/bootstrap'
            },{
                name: 'spin',
                location: './spinjs',
                main: 'spin'
            },{
                name: 'ladda',
                location: './ladda-bootstrap',
                main: 'dist/ladda'
            }
        ]
    };
    require(config, ['dojo/parser', 'jquery', 'dojo/domReady!'], function (parser) {
        parser.parse();
    });
})();