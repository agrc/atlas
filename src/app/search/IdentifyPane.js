define([
    'dojo/text!./templates/IdentifyPane.html',

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
        //      **Summary**: Shows details about the selected search result item.
        //      <p>
        //      </p>
        //      **Owner(s)**:
        //      </p>
        //      <p>
        //      **Test Page**: <a href=""></a>
        //      </p>
        //      <p>
        //      **Description**:  Shows details about the selected search result item.
        //      </p>
        //      <p>
        //      **Required Files**:
        //      </p>
        //      <ul><li></li></ul>
        // example:
        // |    var widget = new IdentifyPane({
        // |    }, "node");

        templateString: template,
        baseClass: 'identify-pane',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/search/IdentifyPane::postCreate', arguments);

            this.setupConnections();
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('app/search/IdentifyPane::setupConnections', arguments);

        }
    });
});