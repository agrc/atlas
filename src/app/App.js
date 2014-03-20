define([
    'dojo/text!./templates/App.html',

    'dojo/_base/declare',
    'dojo/_base/array',

    'dojo/dom',
    'dojo/dom-style',
    'dojo/dom-class',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/registry',

    'dojox/fx',

    'agrc/widgets/map/BaseMap',
    'agrc/widgets/map/BaseMapSelector',

    './map/MapButton',
    './Wizard',
    './search/Search',
    './search/ResultsGrid',
    './search/IdentifyPane',

    'ijit/widgets/authentication/LoginRegister'
], function(
    template,

    declare,
    array,

    dom,
    domStyle,
    domClass,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    registry,

    coreFx,

    BaseMap,
    BaseMapSelector,

    MapButton,
    Wizard,
    Search,
    ResultsGrid,
    IdentifyPane,

    LoginRegister
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

            this.childWidgets = [
                new MapButton({
                    title: 'Map Layers',
                    iconName: 'list'
                }, this.layersBtnDiv),
                new MapButton({
                    title: 'Measure Tool',
                    iconName: 'resize-horizontal'
                }, this.measureBtnDiv),
                new MapButton({
                    title: 'Print Map',
                    iconName: 'print'
                }, this.printBtnDiv),
                new Wizard({}, this.wizardDiv),
                new Search({}, this.searchDiv),
                new LoginRegister({
                    appName: AGRC.appName,
                    logoutDiv: this.logoutDiv,
                    showOnLoad: false
                    // securedServicesBaseUrl: ??
                }),
                this.resultsGrid = new ResultsGrid({}, this.resultsGridDiv),
                this.identifyPane = new IdentifyPane({}, this.identifyPaneDiv)
            ];
            this.switchBottomPanel(this.resultsGridDiv);
            this.inherited(arguments);
        },
        startup: function () {
            // summary:
            //      
            console.log('app/App:startup', arguments);
        
            this.inherited(arguments);

            var that = this;
            array.forEach(this.childWidgets, function (widget) {
                that.own(widget);
                widget.startup();
            });

            this.initMap();

            this.buildAnimations();
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
        },
        buildAnimations: function () {
            // summary:
            //      builds the animations used for this widget
            console.log('app/App:buildAnimations', arguments);
        
            var that = this;
            this.openGridAnimation = coreFx.combine([
                coreFx.animateProperty({
                    node: this.gridIdentifyContainer,
                    properties: {
                        height: 250,
                        borderWidth: 1
                    },
                    onEnd: function () {
                        that.map.resize();
                        // TODO: preserve map extent
                    }
                }),
                coreFx.animateProperty({
                    node: this.mapDiv,
                    properties: {
                        bottom: 250
                    }
                })
            ]);
            this.closeGridAnimation = coreFx.combine([
                coreFx.animateProperty({
                    node: this.gridIdentifyContainer,
                    properties: {
                        height: 0,
                        borderWidth: 0
                    },
                    onEnd: function () {
                        that.map.resize();
                        // TODO: preserve map extent
                    }
                }),
                coreFx.animateProperty({
                    node: this.mapDiv,
                    properties: {
                        bottom: 0
                    }
                })
            ]);
        },
        switchBottomPanel: function (node) {
            // summary:
            //      shows the passed in node and hides the other
            // node: DomNode
            console.log('app/App:switchBottomPanel', arguments);
        
            domClass.remove(node, 'hidden');

            var otherNode = (node === this.identifyPane.domNode) ? 
                this.resultsGrid.domNode : this.identifyPane.domNode;

            domClass.add(otherNode, 'hidden');
        }
    });
});
