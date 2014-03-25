define([
    'dojo/text!./templates/BaseMapSelector.html',

    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/dom-construct',

    'agrc/widgets/map/_BaseMapSelector'

], function(
    template,

    declare,
    array,
    domConstruct,

    BaseMapSelector
) {
    return declare([BaseMapSelector], {
        // description:
        //      For switching base maps.

        templateString: template,
        baseClass: 'base-map-selector',
        widgetsInTemplate: false,

        // Properties to be sent into constructor

        postCreate: function() {
            // summary:
            //      Overrides method of same name in dijit._Widget.
            // tags:
            //      private
            console.log('app/map/BaseMapSelector::postCreate', arguments);

            this.inherited(arguments);
        },
        loadDefaultThemes: function (data) {
            // summary:
            //      description
            // param: type or return: type
            console.log('app/map/BaseMapSelector:loadDefaultThemes', arguments);
        
            this.inherited(arguments);

            var that = this;
            array.forEach(data, function (t) {
                domConstruct.create('option', {
                    innerHTML: t.label,
                    value: t.label
                }, that.select);
            });
        },
        onChange: function (evt) {
            // summary:
            //      description
            // evt: Event Object
            console.log('app/map/BaseMapSelector:onChange', arguments);
        
            this.changeTheme(evt.target.value);
        }
    });
});
