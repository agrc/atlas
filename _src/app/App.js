define([
    'app/config',
    'app/Identify',

    'dart-board/FindAddress',

    'dijit/registry',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom',
    'dojo/dom-style',
    'dojo/on',
    'dojo/text!./templates/App.html',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/core/watchUtils',
    'esri/geometry/Extent',
    'esri/layers/FeatureLayer',
    'esri/Map',
    'esri/views/MapView',
    'esri/widgets/Print',

    'ijit/widgets/layout/SideBarToggler',

    'layer-selector',

    'map-tools/MapView',

    'sherlock/providers/WebAPI',
    'sherlock/Sherlock',

    'bootstrap'
], function (
    config,
    Identify,

    FindAddress,

    registry,
    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    dom,
    domStyle,
    on,
    template,
    array,
    declare,
    lang,

    watchUtils,
    Extent,
    FeatureLayer,
    Map,
    MapView,
    Print,

    SideBarToggler,

    LayerSelector,

    AGRCMapView,

    WebAPI,
    Sherlock
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        // childWidgets: Object[]
        //      container for holding custom child widgets
        childWidgets: null,

        // map: agrc.widgets.map.Basemap
        map: null,

        constructor: function () {
            // summary:
            //      first function to fire after page loads
            console.info('app.App::constructor', arguments);

            config.app = this;
            this.childWidgets = [];

            this.inherited(arguments);
        },
        postCreate: function () {
            // summary:
            //      Fires when
            console.log('app.App::postCreate', arguments);

            // set version number
            this.version.innerHTML = config.version;

            this.initMap();

            this.mapView.then(() => {
                this.childWidgets.push(
                    new SideBarToggler({
                        sidebar: this.sideBar,
                        centerContainer: this.centerContainer
                    }, this.sidebarToggle),
                    new FindAddress({
                        mapView: this.mapView,
                        apiKey: config.apiKey,
                        zoomLevel: 17
                    }, this.geocodeNode),
                    new Sherlock({
                        provider: new WebAPI(config.apiKey, config.featureClassNames.gnis, 'NAME'),
                        mapView: this.mapView,
                        maxResultsToDisplay: 10,
                        placeHolder: 'place name ...'
                    }, this.gnisNode),
                    new Sherlock({
                        provider: new WebAPI(config.apiKey, config.featureClassNames.municipalities, 'NAME'),
                        mapView: this.mapView,
                        maxResultsToDisplay: 10,
                        placeHolder: 'city name ...'
                    }, this.cityNode)
                );
                this.printer = new Print({
                    container: this.printDiv,
                    view: this.mapView,
                    printServiceUrl: config.urls.exportWebMap,
                    templates: [{
                        label: 'Portrait (PDF)',
                        format: 'PDF',
                        layout: 'Letter ANSI A Portrait',
                        options: {
                            legendLayers: []
                        }
                    }, {
                        label: 'Landscape (PDF)',
                        format: 'PDF',
                        layout: 'Letter ANSI A Landscape',
                        options: {
                            legendLayers: []
                        }
                    }]
                });
            });

            this.inherited(arguments);

            this.setupConnections();
        },
        setupConnections: function () {
            // summary:
            //      Fires when
            console.log('app.App::setupConnections', arguments);

            on.once(this.egg, 'dblclick', lang.hitch(this, 'showLevel'));
        },
        startup: function () {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app.App::startup', arguments);

            var that = this;
            array.forEach(this.childWidgets, function (widget) {
                console.log(widget.declaredClass);
                that.own(widget);
                widget.startup();
            });

            this.inherited(arguments);
        },
        showLevel: function () {
            // summary:
            //      shows the current map level
            console.log('app.App::showLevel', arguments);

            var parent = this.egg.parentNode;

            var node = document.createElement('span');
            node.setAttribute('class', 'version');
            node.setAttribute('style', 'padding-right:15px;margin-left:-43px;');

            parent.insertBefore(node, this.egg.nextSibling);

            const updateLevel = () => {
                node.innerHTML = 'level: ' + this.mapView.zoom + ' ';
            };

            watchUtils.whenTrue(this.mapView, 'stationary', () => {
                updateLevel();
            });

            updateLevel();
        },
        initMap: function () {
            // summary:
            //      Sets up the map
            console.info('app.App::initMap', arguments);

            let map = new Map();

            this.mapView = new MapView({
                map,
                container: this.mapDiv
            });

            this.agrcMapView = new AGRCMapView(this.mapView);

            this.childWidgets.push(
                new LayerSelector({
                    mapView: this.mapView,
                    quadWord: config.quadWord,
                    baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR'],
                    overlays: ['Address Points', {
                        Factory: FeatureLayer,
                        url: config.urls.landown,
                        id: 'Land Ownership',
                        opacity: 0.5
                    }]
                }),
                new Identify({ mapView: this.mapView })
            );
        }
    });
});
