define([
    'dojo/text!./templates/Search.html',

    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/dom-construct',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',

    '../_CollapsableMixin',
    './QueryLayer',
    './tests/data/mockQueryLayers'

], function(
    template,

    declare,
    array,
    domConstruct,

    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,

    _CollapsableMixin,
    QueryLayer,
    mockQueryLayers
) {
    return declare(
        [_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, _CollapsableMixin], {
        // description:
        //      Encapsulates the search functionality for the app.

        templateString: template,
        baseClass: 'search panel-group',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //    Overrides method of same name in dijit._Widget.
            // tags:
            //    private
            console.log('app/search/Search::postCreate', arguments);

            var that = this;
            array.forEach(mockQueryLayers.queryLayers, function (ql) {
                that.own(new QueryLayer(ql, domConstruct.create('div', {}, that.queryLayersContainer)));
            });

            this.inherited(arguments);
        }
    });
});