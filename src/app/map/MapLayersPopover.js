define([
    'dojo/text!./templates/MapLayersPopover.html',

    'dojo/_base/declare',
    'dojo/dom-construct',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    './ReferenceLayerToggle',
    '../config',
    './MapController',
    './BaseMapSelector'
], function(
    template,

    declare,
    domConstruct,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    ReferenceLayerToggle,
    config,
    MapController,
    BaseMapSelector
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Popover that is toggled by the "Map Layers" map button. 
        //      Contains controls to allow the user to toggle reference and base map layers.

        templateString: template,
        baseClass: 'map-layers-popover',
        widgetsInTemplate: true,


        // Properties to be sent into constructor

        // btn: DomNode
        //      The button that will toggle this popup
        btn: null,

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/map/MapLayersPopover::postCreate', arguments);

            $(this.btn).popover({
                content: this.domNode,
                container: 'body',
                html: true
            });

            this.own(
                // needs to be loaded first before other layers are added to the map
                new BaseMapSelector({
                    map: MapController.map
                }, domConstruct.create('div', {}, this.domNode)),
                new ReferenceLayerToggle({
                    layerName: 'Indian Country and Tribal',
                    mapServiceUrl: config.urls.DEQEnviro,
                    layerIndex: 3,
                    layerProps: {opacity: 0.7}
                }, domConstruct.create('div', {}, this.domNode, 'first')),
                new ReferenceLayerToggle({
                    layerName: 'Land Ownership',
                    mapServiceUrl: config.urls.DEQEnviro,
                    layerIndex: 0,
                    layerProps: {opacity: 0.7}
                }, domConstruct.create('div', {}, this.domNode, 'first')),
                new ReferenceLayerToggle({
                    layerName: 'Hydrolgic Units',
                    mapServiceUrl: config.urls.DEQEnviro,
                    layerIndex: 2,
                    layerProps: {opacity: 0.7}
                }, domConstruct.create('div', {}, this.domNode, 'first')),
                new ReferenceLayerToggle({
                    layerName: 'Township/Range/Section',
                    mapServiceUrl: config.urls.UtahPLSS,
                    tiledService: true
                }, domConstruct.create('div', {}, this.domNode, 'first')),
                new ReferenceLayerToggle({
                    layerName: 'Environmental Covenants',
                    mapServiceUrl: config.urls.DEQEnviro,
                    layerIndex: 1,
                    layerProps: {opacity: 0.7}
                }, domConstruct.create('div', {}, this.domNode, 'first'))
            );
        }
    });
});
