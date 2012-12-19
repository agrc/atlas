function copyOnly(mid) {
    return mid in {
        // 'app/profile': 1
    };
}

var profile = {
    // basePath: '..',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: 'closure',
    layerOptimize: 'closure',
    stripConsole: 'all',
    selectorEngine: 'acme',
    layers: {
        'app/run': {
            include: ['app/main', 'app/run'],
            exclude: [
                "dijit/_base/scroll",
                "dijit/_TemplatedMixin",
                "dijit/_Templated",
                "dijit/_WidgetBase",
                "dijit/_TemplatedMixin",
                "dijit/_WidgetsInTemplateMixin",
                "dojo/_base/array",
                "dojo/_base/declare",
                "dojo/_base/lang",
                "dojo/_base/kernel",
                "dojox/gfx/matrix",
                "dojo/_base/Color",
                "dojox/gfx/_base",
                "dojox/xml/parser",
                "dojox/gfx",
                "dojo/fx",
                "dojo/date",
                "dojo/date/locale",
                "dojo/io/script",
                "dojo/_base/url",
                "dojox/collections/ArrayList",
                "dojo/string",
                "dojo/fx/Toggler",
                "dijit/_base/manager",
                "dijit/form/HorizontalSlider",
                "dijit/form/VerticalSlider",
                "dijit/form/HorizontalRule",
                "dijit/form/VerticalRule",
                "dijit/form/HorizontalRuleLabels",
                "dijit/form/VerticalRuleLabels",
                "dijit/_base",
                "dijit/form/DropDownButton",
                "dijit/form/ComboButton",
                "dijit/form/ToggleButton"
            ]
        }
    },
    staticHasFeatures: {
        // The trace & log APIs are used for debugging the loader, so we don’t need them in the build
        'dojo-trace-api':0,
        'dojo-log-api':0,

        // This causes normally private loader data to be exposed for debugging, so we don’t need that either
        'dojo-publish-privates':0,

        // We’re fully async, so get rid of the legacy loader
        // 'dojo-sync-loader':0,
        
        // dojo-xhr-factory relies on dojo-sync-loader
        // 'dojo-xhr-factory':0,

        // We aren’t loading tests in production
        'dojo-test-sniff':0
    },
    resourceTags: {
        test: function (filename, mid) {
            // TODO: filter out tests
            return false;
        },
        copyOnly: function (filename, mid) {
            return copyOnly(mid);
        },
        // TODO: filter out agrc, ijit, and esri?
        amd: function (filename, mid) {
            return !copyOnly(mid) && /\.js$/.test(filename);
        },
        miniExclude: function (filename, mid) {
            return mid in {
                'app/profile': 1
            };
        }
    },
    packages: [{
        name: 'dojo',
        location: '../dojo'
    },{
        name: 'dijit',
        location: '../dijit'
    },{
        name: 'dojox',
        location: '../dojox'
    }]
};