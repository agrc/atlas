define([
    'dojo/text!./templates/ResultsGrid.html',

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
        //      **Summary**: Sorts and displays the search results.
        //      <p>
        //      </p>
        //      **Owner(s)**:
        //      </p>
        //      <p>
        //      **Test Page**: <a href=""></a>
        //      </p>
        //      <p>
        //      **Description**:  Sorts and displays the search results.
        //      </p>
        //      <p>
        //      **Required Files**:
        //      </p>
        //      <ul><li></li></ul>
        // example:
        // |    var widget = new ResultsGrid({
        // |    }, "node");

        templateString: template,
        baseClass: 'results-grid',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('src/app/search/ResultsGrid::postCreate', arguments);

            this.setupConnections();
        },
        setupConnections: function() {
            // summary:
            //      wire events, and such
            //
            console.log('src/app/search/ResultsGrid::setupConnections', arguments);

        }
    });
});