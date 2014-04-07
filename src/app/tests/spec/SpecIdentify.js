require([
    'app/Identify'

], function(
    ClassUnderTest
) {
    describe('app/Identify', function() {
        var testWidget;
        var map;
        var evt = {
            mapPoint: {
                x: 415652.65472246887,
                y: 4447848.04338003
            }
        };
        var infoWindow;

        afterEach(function() {
            if (testWidget) {
                if (testWidget.destroy) {
                    testWidget.destroy();
                }

                testWidget = null;
            }
        });

        beforeEach(function() {
            map = jasmine.createSpyObj('map', ['on']);
            infoWindow = jasmine.createSpyObj('infoWindow',
                ['show', 'setTitle', 'setContent', 'resize']
            );
            map.infoWindow = infoWindow;
            testWidget = new ClassUnderTest({
                map: map
            });
        });

        describe('Sanity', function() {
            it('should create a Identify', function() {
                expect(testWidget).toEqual(jasmine.any(ClassUnderTest));
                expect(testWidget.map).toBe(map);
            });
        });
        describe('onMapClick', function () {
            beforeEach(function () {
                testWidget.onMapClick(evt);
            });
            it('shows the popup', function () {
                expect(infoWindow.show).toHaveBeenCalledWith(evt.mapPoint);
            });
            it('rounds utms to whole numbers and lat/longs to 5 decimal places', function () {
                expect(testWidget.utmX.innerHTML.split('.').length).toBe(1);
                expect(testWidget.utmY.innerHTML.split('.').length).toBe(1);
                expect(testWidget.lat.innerHTML.split('.')[1].length).toBe(5);
                expect(testWidget.lng.innerHTML.split('.')[1].length).toBe(5);
            });
        });
        describe('clearValues', function () {
            it('clears all values', function () {
                testWidget.utmX.innerHTML = 'blah';
                testWidget.utmY.innerHTML = 'blah';
                testWidget.lat.innerHTML = 'blah';
                testWidget.lng.innerHTML = 'blah';
                testWidget.county.innerHTML = 'blah';
                testWidget.municipality.innerHTML = 'blah';
                testWidget.landOwner.innerHTML = 'blah';

                testWidget.clearValues();

                expect(testWidget.utmX.innerHTML).toEqual('');
                expect(testWidget.utmY.innerHTML).toEqual('');
                expect(testWidget.lat.innerHTML).toEqual('');
                expect(testWidget.lng.innerHTML).toEqual('');
                expect(testWidget.county.innerHTML).toEqual('');
                expect(testWidget.municipality.innerHTML).toEqual('');
                expect(testWidget.landOwner.innerHTML).toEqual('');
            });
        });
    });
});