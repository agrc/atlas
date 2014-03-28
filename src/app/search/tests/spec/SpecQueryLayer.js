require([
    'app/search/QueryLayer',
    'app/config',

    'dojo/_base/window',

    'dojo/dom-construct',

    'matchers/Topics'
], function(
    WidgetUnderTest,
    config,

    win,

    domConstruct,

    Topics
) {
    describe('app/search/QueryLayer', function() {
        var widget;
        var destroy = function (widget) {
            widget.destroyRecursive();
            widget = null;
        };

        beforeEach(function() {
            widget = new WidgetUnderTest({
                layerName: 'blah',
                layerIndex: 0,
                metaDataUrl: 'blah',
                description: 'hello'
            }, domConstruct.create('div', null, win.body()));
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a QueryLayer', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
        describe('onCheckboxChange', function () {
            var topics = config.topics.appQueryLayer;
            beforeEach(function () {
                Topics.listen(topics.addLayer);
            });
            it('shows and hides the layer according to checkbox state', function () {
                widget.checkbox.checked = true;
                var layer = jasmine.createSpyObj('layer', ['setVisibility']);
                widget.layer = layer;

                widget.onCheckboxChange();

                expect(layer.setVisibility).toHaveBeenCalledWith(true);
            });
            it('fires the addLayer topic if the layer hasn\'t been created yet', function () {
                widget.checkbox.checked = true;

                widget.onCheckboxChange();

                expect(topics.addLayer).toHaveBeenPublishedWith(widget.layer);
                expect(topics.toggleLayer).not.toHaveBeenPublished();
            });
        });
    });
});