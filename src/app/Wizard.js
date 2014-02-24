define([
    'dojo/text!./templates/Wizard.html',

    'dojo/_base/declare',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',


    'use!bootstrap'
], function(
    template,

    declare,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin
) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        // description:
        //      The title pane with help text.

        templateString: template,
        baseClass: 'wizard panel-group',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/Wizard::postCreate', arguments);

            $(this.anchor).collapse({
                parent: this.domNode,
                toggle: false
            });

            this.setupConnections();
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('app/Wizard::setupConnections', arguments);

        }
    });
});