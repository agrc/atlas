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


        // Properties to be sent into constructor

        // name: String
        //      The name of the query layer
        name: null,

        // index: Number
        //      The index of the layer within the query layers map service
        index: null,

        // description: String
        //      The text that you want to show up in the popup
        description: null,

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

            $(this.helpTip).tooltip();

            this.inherited(arguments);
        },
        onCheckboxChange: function () {
            // summary:
            //      Fires when checkbox checked state changes
            console.log('app/QueryLayer:onCheckboxChange', arguments);

            var t = (this.checkbox.checked) ? topics.addLayer : topics.removeLayer;
            topic.publish(t, this);
        }
    });
});
