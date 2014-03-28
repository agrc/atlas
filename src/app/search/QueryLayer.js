define([
    'dojo/text!./templates/QueryLayer.html',

    'dojo/_base/declare',
    'dojo/_base/Color',
    'dojo/topic',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    'esri/layers/FeatureLayer',
    'esri/renderers/SimpleRenderer',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/SimpleLineSymbol',

    '../config'

], function(
    template,

    declare,
    Color,
    topic,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    FeatureLayer,
    SimpleRenderer,
    SimpleMarkerSymbol,
    SimpleLineSymbol,

    config
) {
    var topics = config.topics.appQueryLayer;
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Encapsulates the query layer controls and functionality.

        templateString: template,
        baseClass: 'query-layer',
        widgetsInTemplate: true,

        // layer: esri/layers/FeatureLayer
        //      The feature layer associated with this widget
        layer: null,


        // Properties to be sent into constructor

        // layerName: String
        //      The name of the query layer
        layerName: null,

        // layerIndex: Number
        //      The index of the layer within the query layers map service
        layerIndex: null,

        // layerDescription: String
        //      The text that you want to show up in the popup
        layerDescription: null,

        // metaDataUrl: String
        //      The URL for the metadata page for this layer.
        //      The help button is linked to this URL
        metaDataUrl: null,

        postCreate: function() {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('app/QueryLayer::postCreate', arguments);

            this.renderer = new SimpleRenderer(new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                config.queryLayer.size,
                new SimpleLineSymbol(),
                new Color(config.queryLayer.color)
            ));

            $(this.helpTip).tooltip();

            this.inherited(arguments);
        },
        onCheckboxChange: function () {
            // summary:
            //      Fires when checkbox checked state changes
            console.log('app/QueryLayer:onCheckboxChange', arguments);

            if (!this.layer) {
                this.layer = new FeatureLayer(config.urls.DEQEnviro + '/' + this.layerIndex, {
                    opacity: config.queryLayer.opacity,
                    outFields: ['*']
                });
                this.layer.setRenderer(this.renderer);
                topic.publish(topics.addLayer, this.layer);
            } else {
                this.layer.setVisibility(this.checkbox.checked);
            }
        }
    });
});
