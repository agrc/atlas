define([
    './config',
    './Identify',

    'dart-board/FindAddress',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',
    'dijit/_WidgetsInTemplateMixin',

    'dojo/dom-class',
    'dojo/on',
    'dojo/text!./data/cityExtents.json',
    'dojo/text!./templates/App.html',
    'dojo/_base/declare',

    'esri/core/watchUtils',
    'esri/geometry/Polygon',
    'esri/layers/FeatureLayer',
    'esri/Map',
    'esri/views/MapView',
    'esri/widgets/Print',

    'layer-selector',

    'map-tools/MapView',

    'sherlock/providers/WebAPI',
    'sherlock/Sherlock',

    'bootstrap'
], function (
    config,
    Identify,

    FindAddress,

    _TemplatedMixin,
    _WidgetBase,
    _WidgetsInTemplateMixin,

    domClass,
    on,
    cityExtentsTxt,
    template,
    declare,

    watchUtils,
    Polygon,
    FeatureLayer,
    Map,
    MapView,
    Print,

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

        // mapView: map-tools/MapView
        mapView: null,

        //      used to preserve the current extent between sessions
        localStorageKeys: {
            zoom: 'agrc-atlas-current-zoom',
            center: 'agrc-atlas-current-center'
        },

        constructor() {
            // summary:
            //      first function to fire after page loads
            console.log('app/App:constructor', arguments);

            config.app = this;
            this.childWidgets = [];

            this.inherited(arguments);
        },
        postCreate() {
            // summary:
            //      Fires when
            console.log('app/App:postCreate', arguments);

            if (window.innerWidth < config.minWidthToShowSidebarOnLoad) {
                this.toggleSidebar();
            }

            // set version number
            this.version.innerHTML = config.version;

            this.initMap();

            this.mapView.when(() => {
                this.childWidgets.push(
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
        toggleSidebar() {
            // summary:
            //      Toggles the CSS classes to make the side bar collapse/expand
            console.log('app/App:toggleSidebar', arguments);

            domClass.toggle(this.sideBar, 'open closed');
            domClass.toggle(this.centerContainer, 'sidebar-open sidebar-closed');
            domClass.toggle(this.sideBarToggle, 'glyphicon-chevron-right glyphicon-chevron-left');
        },
        setupConnections() {
            // summary:
            //      Fires when
            console.log('app/App:setupConnections', arguments);

            on.once(this.egg, 'dblclick', this.showLevel.bind(this));
        },
        startup() {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log('app/App:startup', arguments);

            this.childWidgets.forEach((widget) => {
                this.own(widget);
                widget.startup();
            });

            this.inherited(arguments);
        },
        showLevel() {
            // summary:
            //      shows the current map level
            console.log('app/App:showLevel', arguments);

            const parent = this.egg.parentNode;

            const node = document.createElement('span');
            node.setAttribute('class', 'version');
            node.setAttribute('style', 'padding-right:15px;margin-left:-43px;');

            parent.insertBefore(node, this.egg.nextSibling);

            const updateLevel = () => {
                node.innerHTML = `level: ${this.mapView.zoom} `;
            };

            watchUtils.whenTrue(this.mapView, 'stationary', () => {
                updateLevel();
            });

            updateLevel();
        },
        initMap() {
            // summary:
            //      Sets up the map
            console.log('app/App:initMap', arguments);

            const map = new Map();

            this.mapView = new MapView({
                map,
                container: this.mapDiv
            });

            this.agrcMapView = new AGRCMapView(this.mapView);

            const center = localStorage.getItem(this.localStorageKeys.center);
            const zoom = localStorage.getItem(this.localStorageKeys.zoom);
            if (zoom && center) {
                this.mapView.zoom = zoom;
                this.mapView.center = JSON.parse(center);
            } else {
                const cityExtents = JSON.parse(cityExtentsTxt);
                const randomExtent = cityExtents[Math.round(Math.random() * (cityExtents.length - 1))];
                this.mapView.extent = new Polygon(randomExtent.geometry).extent;
            }

            watchUtils.whenTrue(this.mapView, 'stationary', () => {
                if (!this.mapView.zoom || !this.mapView.center) {
                    return;
                }

                localStorage.setItem(this.localStorageKeys.zoom, this.mapView.zoom);
                localStorage.setItem(this.localStorageKeys.center, JSON.stringify(this.mapView.center.toJSON()));
            });

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
