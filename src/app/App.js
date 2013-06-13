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
    'ijit/widgets/layout/PaneStack',
    'agrc/widgets/locate/FindAddress',
    'agrc/widgets/locate/FindGeneric',
    'agrc/widgets/map/BaseMapSelector',
    'esri/dijit/Print',

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
    PaneStack,
    FindAddress,
    FindGeneric,
    BaseMapSelector,
    Print
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
            
            var ps;
            var sb;
            var fa;
            var fp;
            var fm;

            ps = new PaneStack(null, this.paneStack);
            
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

            fp = new FindGeneric({
                map: this.map,
                layerName: 'SGID10.LOCATION.PlaceNamesGNIS2000',
                searchFieldName: 'NAME',
                fieldLabel: 'GNIS Name'
            }, this.gnisNode);

            fm = new FindGeneric({
                map: this.map,
                layerName: 'SGID10.BOUNDARIES.Municipalities',
                searchFieldName: 'NAME',
                fieldLabel: 'Name'
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