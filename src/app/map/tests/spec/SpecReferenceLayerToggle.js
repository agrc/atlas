require([
    'app/config',
    'app/map/ReferenceLayerToggle',

    'dojo/_base/window',
    'dojo/dom-construct',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',

    'matchers/Topics'
], function(
    config,
    WidgetUnderTest,

    win,
    domConstruct,

    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,

    Topics
) {
    var url = '/arcgis/rest/services/Wildlife/Data/MapServer';
    var index = 3;
    var destroy = function (widget) {
        widget.destroyRecursive();
        widget = null;
    };
    var topics = config.topics.appMapReferenceLayerToggle;

    describe('app/map/ReferenceLayerToggle', function() {
        beforeEach(function () {
            Topics.listen(topics.addLayer);
            Topics.listen(topics.toggleLayer);
        });
        var widget;
        beforeEach(function() {
            widget = new WidgetUnderTest({
                layerName: 'blah',
                mapServiceUrl: url,
                layerIndex: index,
                tiledService: true
            }, domConstruct.create('div', null, win.body()));
        });

        afterEach(function() {
            if (widget) {
                destroy(widget);
            }
        });

        describe('Sanity', function() {
            it('should create a ReferenceLayerToggle', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
            it('published the appropriate addLayer topic', function () {
                expect(topics.addLayer).toHaveBeenPublishedWith(url, true, index);
            });
            it('publishes the appropriate toggleLayer topic', function () {
                widget.checkbox.checked = true;
                widget.onCheckboxChange();

                expect(topics.toggleLayer).toHaveBeenPublishedWith(url, index, true);
            });
        });

    });
});