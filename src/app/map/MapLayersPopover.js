define([
    'dojo/text!./templates/MapLayersPopover.html',

    'dojo/_base/declare',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',


    // 'bootstrap'
], function(
    template,

    declare,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Popover that is toggled by the "Map Layers" map button. Contains controls to allow the user to toggle reference and base map layers.

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

            this.setupConnections();
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('app/map/MapLayersPopover::setupConnections', arguments);

        }
    });
});
