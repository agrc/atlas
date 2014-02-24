define([
    'dojo/text!app/templates/App.html',

    'dojo/_base/declare',

    'dojo/dom',
    'dojo/dom-style',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/registry',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    'app/MapButton',
    'app/Wizard',


    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane'
], function(
    template,

    declare,

    dom,
    domStyle,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    registry,

    BaseMap,
    BaseMapSelector,

    MapButton,
    Wizard
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        // map: agrc.widgets.map.Basemap
        map: null,

        constructor: function() {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            AGRC.app = this;

            this.inherited(arguments);
        },
        postCreate: function() {
            // summary:
            //      Fires when
            console.log('app.App::postCreate', arguments);

            // set version number
            this.version.innerHTML = AGRC.version;

            new MapButton({
                title: 'Map Layers',
                iconName: 'list'
            }, this.layersBtnDiv);
            new MapButton({
                title: 'Measure Tool',
                iconName: 'resize-horizontal'
            }, this.measureBtnDiv);
            new MapButton({
                title: 'Print Map',
                iconName: 'print'
            }, this.printBtnDiv);
            new Wizard({}, this.wizardDiv);
        },
        initMap: function() {
            // summary:
            //      Sets up the map
            console.info('app.App::initMap', arguments);

            this.map = new BaseMap(this.mapDiv, {
                useDefaultBaseMap: false
            });

            var selector;

            selector = new BaseMapSelector({
                map: this.map,
                id: 'claro',
                position: 'TR'
            });
        }
    });
});
