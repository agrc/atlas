define([
    'dojo/text!./templates/ReferenceLayerToggle.html',

    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    '../config'

], function(
    template,

    declare,
    array,
    topic,

    _WidgetBase,
    _TemplatedMixin,

    config
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:
        //      Provides controls for the user to show/hide a reference layer on the map. 
        //      Can handle stand-alone services or individual layers within a service.

        templateString: template,
        baseClass: 'reference-layer-toggle',

        // layer: esri/layers/Layer
        //      The map service layer associated with this widget
        layer: null,

        // topics: Object
        //      The topic names related to this widget
        topics: config.topics.appMapReferenceLayerToggle,


        // Properties to be sent into constructor

        // layerName: String
        //      The name of the layer that will show up next to the checkbox
        layerName: null,

        // mapServiceUrl: String
        //      The Url to the map service associated with this widget
        mapServiceUrl: null,

        // layerIndex: Number [optional]
        //      The index number of the layer within the map service that you want this
        //      widget to be associated with
        layerIndex: null,

        // tiledService: Boolean [optional]
        //      True is the layer is a tile map service. Defaults to false.
        tiledService: null,

        // layerProps: Object [optional]
        //      Properites to be passed in to the layer constructor
        layerProps: null,

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/map/ReferenceLayerToggle::postCreate', arguments);

            topic.publish(
                this.topics.addLayer,
                this.mapServiceUrl,
                this.tiledService,
                this.layerIndex,
                this.layerProps
            );

            this.inherited(arguments);
        },
        onCheckboxChange: function () {
            // summary:
            //      Fired when the user toggles the checkbox
            console.log('app/map/ReferenceLayerToggle:onCheckboxChange', arguments);
        
            topic.publish(this.topics.toggleLayer, this.mapServiceUrl, this.layerIndex, this.checkbox.checked);
        }
    });
});
