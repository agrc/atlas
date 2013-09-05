define([
    'dijit/registry', 
    'dojo/dom', 
    'dojo/_base/declare',
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin', 
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!app/templates/App.html',
    'agrc/widgets/map/BaseMap',
    // 'ijit/modules/ErrorLogger',
    'ijit/widgets/layout/SideBarToggler',
    'agrc/widgets/locate/FindAddress',
    'agrc/widgets/locate/MagicZoom',
    'agrc/widgets/map/BaseMapSelector',
    'esri/dijit/Print',
    'dojo/dom-style',

    'dijit/layout/BorderContainer',
    'dijit/layout/ContentPane'
], 

function (
    registry, 
    dom, 
    declare, 
    _WidgetBase, 
    _TemplatedMixin, 
    _WidgetsInTemplateMixin, 
    template, 
    BaseMap, 
    // ErrorLogger, 
    SideBarToggler, 
    FindAddress,
    MagicZoom,
    BaseMapSelector,
    Print,
    domStyle
    ) {
    return declare("app/App", 
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
        {
        // summary:
        //      The main widget for the app

        widgetsInTemplate: true,
        templateString: template,
        baseClass: 'app',

        // map: agrc.widgets.map.Basemap
        map: null,
        
        constructor: function(){
            // summary:
            //      first function to fire after page loads
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);

            // AGRC.errorLogger = new ErrorLogger({appName: 'ProjectName'});
            
            AGRC.app = this;

            this.inherited(arguments);
        },
        postCreate: function () {
            // summary:
            //      Fires when 
            console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
            // set version number
            this.version.innerHTML = AGRC.version;

            this.inherited(arguments);
        },
        startup: function () {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);

            // call this before creating the map to make sure that the map container is 
            // the correct size
            this.inherited(arguments);
            
            var sb;
            var fa;
            var fp;
            var fm;

            this.initMap();
            
            sb = new SideBarToggler({
                sidebar: this.sideBar.domNode,
                mainContainer: this.mainContainer,
                map: this.map,
                centerContainer: this.centerContainer.domNode
            }, this.sidebarToggle);

            fa = new FindAddress({
                map: this.map,
                apiKey: AGRC.apiKey
            }, this.geocodeNode);

            fp = new MagicZoom({
                map: this.map,
                mapServiceURL: AGRC.urls.vector,
                searchLayerIndex: 4,
                searchField: 'NAME',
                placeHolder: 'place name...',
                maxResultsToDisplay: 10,
                'class': 'first'
            }, this.gnisNode);

            fm = new MagicZoom({
                map: this.map,
                layerName: AGRC.urls.vector,
                searchLayerIndex: 1,
                searchField: 'NAME',
                placeHolder: 'city name...',
                maxResultsToDisplay: 10
            }, this.cityNode);

            this.inherited(arguments);

            this.printer = new Print({
                map: this.map,
                url: AGRC.exportWebMapUrl,
                templates: [
                    {
                        label: 'Portrait (PDF)',
                        format: 'PDF',
                        layout: 'Letter ANSI A Portrait',
                        options: {
                            legendLayers: []
                        }
                    },{
                        label: 'Landscape (PDF)',
                        format: 'PDF',
                        layout: 'Letter ANSI A Landscape',
                        options: {
                            legendLayers: []
                        }
                    }
                ]
            }, this.printDiv);
            this.printer.startup();
            var that = this;
            this.printer.on('print-complete', function () {
                domStyle.set(that.popupBlurb, 'display', 'block');
            });
        },
        initMap: function(){
            // summary:
            //      Sets up the map
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            this.map = new BaseMap(this.mapDiv, {
                useDefaultBaseMap: false
            });

            var s;

            s = new BaseMapSelector({
                map: this.map,
                id: 'claro',
                position: 'TR'
            });
        }
    });
});