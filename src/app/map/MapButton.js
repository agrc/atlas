define([
    'dojo/text!./templates/MapButton.html',

    'dojo/_base/declare',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin'

], function(
    template,

    declare,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      Tool buttons for placing below the zoom controls on the map.
        //      NOTE: This widget must be placed within a div.map-button-container 
        //      within the map div. This is to allow for multiple buttons per map.

        templateString: template,
        baseClass: 'map-button',
        widgetsInTemplate: false,

        // Properties to be sent into constructor
        // title: String
        //      The title of the button. Shows on hover as alt text.
        title: null,

        // iconName: String
        //      The name of the glyphicon (bundled with bootstrap) that you want
        //      to use with this tool. For example, `list`.
        iconName: null,

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/MapButton::postCreate', arguments);

            this.setupConnections();
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('app/MapButton::setupConnections', arguments);

        }
    });
});