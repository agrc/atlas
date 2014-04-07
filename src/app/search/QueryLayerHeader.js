define([
    'dojo/text!./templates/QueryLayerHeader.html',

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
        //      A collapsable container to hold QueryLayer widgets that share the same heading.

        templateString: template,
        baseClass: 'query-layer-header panel panel-default',
        widgetsInTemplate: true,

        // Properties to be sent into constructor

        // name: String
        //      The name of the heading
        name: null
    });
});
