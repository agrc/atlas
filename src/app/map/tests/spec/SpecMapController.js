require([
    'app/map/MapController',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer'


], function(
    ClassUnderTest,

    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer
) {
    describe('app/map/MapController', function() {
        var testObject;
        var map;
        var layer;
        var url = 'blah';

        beforeEach(function() {
            layer = jasmine.createSpyObj('layer', ['hide', 'show', 'setVisibleLayers']);
            layer.url = url;
            map = jasmine.createSpyObj('map', [
                'addLayer',
                'addLoaderToLayer',
                'on'
            ]);
            map.on.and.returnValue({remove: function () {}});

            testObject = ClassUnderTest;
            testObject.init({map: map});
        });

        afterEach(function() {
            if (testObject) {
                if (testObject.destroy) {
                    testObject.destroy();
                }

                testObject = null;
            }
        });

        describe('Sanity', function() {
            it('should create a MapController', function() {
                expect(testObject).toEqual(jasmine.any(Object));
            });
        });
        describe('addReferenceLayer', function () {
            it('doesn\'t add the layer to the map if it\'s already added', function () {
                map.layerIds = ['one', 'two'];
                map.getLayer = function (/* layerId */) {
                    return layer;
                };
                testObject.addReferenceLayer(url, false, null);

                expect(map.addLayer).not.toHaveBeenCalled();
            });
            it('adds the correct layer type', function () {
                testObject.addReferenceLayer('blah', false, null);

                expect(map.addLayer).toHaveBeenCalledWith(jasmine.any(ArcGISDynamicMapServiceLayer));
                expect(map.addLoaderToLayer).toHaveBeenCalled();

                testObject.addReferenceLayer('blah', true, null);

                expect(map.addLayer).toHaveBeenCalledWith(jasmine.any(ArcGISTiledMapServiceLayer));
            });
            it('can handle a layer within a map service', function () {
                testObject.addReferenceLayer('blah', false, 1);

                var lyr = map.addLayer.calls.mostRecent().args[0];

                expect(lyr.visible).toBe(true);
                expect(lyr.visibleLayers).toEqual([-1]);
            });
        });

        describe('toggleReferenceLayer', function () {
            beforeEach(function () {
                map.layerIds = ['one', 'two'];
                map.getLayer = function (/* layerId */) {
                    return layer;
                };
            });
            it('hides the layer', function () {
                testObject.toggleReferenceLayer(url, null, false);

                expect(layer.hide).toHaveBeenCalled();
                expect(layer.show).not.toHaveBeenCalled();
            });
            it('shows the layer', function () {
                testObject.toggleReferenceLayer(url, null, true);

                expect(layer.hide).not.toHaveBeenCalled();
                expect(layer.show).toHaveBeenCalled();
            });
            it('calls setVisibleLayers if layerIndex is passed', function () {
                layer.visibleLayers = [1, 2];

                testObject.toggleReferenceLayer(url, 0, true);

                expect(layer.setVisibleLayers).toHaveBeenCalledWith([1, 2, 0]);

                layer.visibleLayers = [1, 2, 0];
                testObject.toggleReferenceLayer(url, 0, false);

                expect(layer.setVisibleLayers.calls.mostRecent().args[0]).toEqual([1, 2]);
                expect(layer.hide).not.toHaveBeenCalled();
                expect(layer.show).not.toHaveBeenCalled();
            });
        });
        describe('addQueryLayer', function () {
            it('adds the layer to the map', function () {
                var lyr = {};

                testObject.addQueryLayer(lyr);

                expect(map.addLayer).toHaveBeenCalledWith(lyr);
            });
        });
    });
});