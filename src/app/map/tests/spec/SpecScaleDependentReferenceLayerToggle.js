require([
    'app/map/ScaleDependentReferenceLayerToggle',
    'app/config',

    'dojo/_base/window',

    'dojo/dom-construct',
    'dojo/topic'
], function(
    WidgetUnderTest,
    config,

    win,

    domConstruct,
    topic
) {
    describe('app/map/ScaleDependentReferenceLayerToggle', function() {
        var widget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };

        beforeEach(function() {
            widget = new WidgetUnderTest({
                minScaleLevel: 5
            }, domConstruct.create('div', null, win.body()));
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a ScaleDependentReferenceLayerToggle', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('disable', function () {
            it('disables if scale level is above minScaleLevel', function () {
                widget.checkbox.disabled = false;

                topic.publish(config.topics.appMapController.mapZoom, 10);

                expect(widget.checkbox.disabled).toBe(false);
            });
            it('enables', function () {
                widget.checkbox.disabled = true;

                topic.publish(config.topics.appMapController.mapZoom, 3);

                expect(widget.checkbox.disabled).toBe(true);
            });
        });
    });
});