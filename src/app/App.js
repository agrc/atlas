define([
    'dijit/registry', 
    'dojo/dom', 
    'dojo/_base/declare',
    'dijit/_WidgetBase', 
    'dijit/_TemplatedMixin', 
    'dijit/_WidgetsInTemplateMixin',
    'dojo/text!app/templates/App.html',
    'agrc/widgets/map/BaseMap',
    'ijit/modules/ErrorLogger',
    'ijit/widgets/layout/SideBarToggler',
    'ijit/widgets/layout/PaneStack',

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
    ErrorLogger, 
    SideBarToggler, 
    PaneStack
    ) {
    return declare("app.App", 
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

            // esri.config.defaults.io.corsEnabledServers.push("dagrc.utah.gov");
            
            AGRC.errorLogger = new ErrorLogger({appName: 'ProjectName'});
            
            // global reference
            AGRC.app = this;
        },
        postCreate: function () {
            // summary:
            //      Fires when 
            console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);
        
            // set version number
            this.version.innerHTML = AGRC.version;
        },
        startup: function () {
            // summary:
            //      Fires after postCreate when all of the child widgets are finished laying out.
            console.log(this.declaredClass + "::" + arguments.callee.nom, arguments);

            // call this before creating the map to make sure that the map container is 
            // the correct size
            this.inherited(arguments);
            
            var ps;
            // var sb;

            ps = new PaneStack(null, this.paneStack);
            
            this.initMap();
            
            // sb = new SideBarToggler({
            //     sidebar: this.sideBar.domNode,
            //     mainContainer: this.mainContainer,
            //     map: this.map,
            //     centerContainer: this.centerContainer.domNode
            // }, this.sidebarToggle);
        },
        initMap: function(){
            // summary:
            //      Sets up the map
            console.info(this.declaredClass + "::" + arguments.callee.nom, arguments);
            
            this.map = new BaseMap(this.mapDiv);
        }
    });
});