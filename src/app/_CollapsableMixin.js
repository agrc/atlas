define([
    'dojo/_base/declare',

    'bootstrap'
], function(
    declare
) {
    return declare(null, {
        // description:
        //      A mixin for bootstrap collapsable components.


        postCreate: function () {
            // summary:
            //      description
            console.log('app/_CollapsableMixin::postCreate', arguments);
        
            $('.collapse', this.domNode).collapse({
                parent: this.domNode,
                toggle: false
            });

            this.inherited(arguments);
        }
    });
});