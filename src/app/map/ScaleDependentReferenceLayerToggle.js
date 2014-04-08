define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/topic',
    'dojo/dom-class',

    './ReferenceLayerToggle',
    '../config'
], function(
    declare,
    lang,
    topic,
    domClass,

    ReferenceLayerToggle,
    config
) {
    return declare([ReferenceLayerToggle], {
        // description:
        //      Adds scale dependency functionality to ReferenceLayerToggle.

        // msg: String
        //      The popup text message
        msg: 'Zoom in to see this layer',


        // passed in via the constructor

        // minScaleLevel: Number
        //      The minimum scale level that you want this widget to be enabled
        minScaleLevel: null,

        postCreate: function () {
            // summary:
            //      description
            console.log('app.map.ScaleDependentReferenceLayerToggle::postCreate', arguments);
        
            // default to disabled
            this.updateDisabledState(this.minScaleLevel - 1);

            this.own(
                topic.subscribe(config.topics.appMapController.mapZoom, lang.hitch(this, 'updateDisabledState'))
            );
            
            this.inherited(arguments);
        },
        updateDisabledState: function (zoomLevel) {
            // summary:
            //      
            // zoomLevel: Number
            //    The new zoom level of the map
            console.log('app.map.ScaleDependentReferenceLayerToggle::updateDisabledState', arguments);
        
            if (zoomLevel < this.minScaleLevel) {
                this.checkbox.disabled = true;
                domClass.add(this.label, 'disabled');
                this.createTooltip();
            } else {
                this.checkbox.disabled = false;
                domClass.remove(this.label, 'disabled');
                $(this.domNode).tooltip('destroy');
            }
        },
        createTooltip: function () {
            // summary:
            //      creates a tooltip for this widget
            console.log('app.map.ScaleDependentReferenceLayerToggle::createTooltip', arguments);
        
            $(this.domNode).tooltip({
                title: this.msg,
                delay: {
                    show: 1000,
                    hide: 100
                },
                placement: 'right',
                container: 'body'
            });
        }
    });
});