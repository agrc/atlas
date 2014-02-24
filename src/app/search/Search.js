define([
    'dojo/text!./templates/Search.html',

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
        //      **Summary**: Encapsulates the search functionality for the app.
        //      <p>
        //      </p>
        //      **Owner(s)**:
        //      </p>
        //      <p>
        //      **Test Page**: <a href=""></a>
        //      </p>
        //      <p>
        //      **Description**:  Encapsulates the search functionality for the app.
        //      </p>
        //      <p>
        //      **Required Files**:
        //      </p>
        //      <ul><li></li></ul>
        // example:
        // |    var widget = new Search({
        // |    }, "node");

        templateString: template,
        baseClass: 'search',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/search/Search::postCreate', arguments);

            this.setupConnections();
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('app/search/Search::setupConnections', arguments);

        }
    });
});