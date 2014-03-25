require([
    'app/map/BaseMapSelector',

    'dojo/_base/window',

    'dojo/dom-construct'
], function(
    WidgetUnderTest,

    win,

    domConstruct
) {
    describe('app/map/BaseMapSelector', function() {
        var widget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };

        beforeEach(function() {
            widget = new WidgetUnderTest({
                map: {
                    layerIds: [],
                    addLayer: function () {},
                    removeLayer: function () {}
                }
            }, domConstruct.create('div', null, win.body()));
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a BaseMapSelector', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
    });
});