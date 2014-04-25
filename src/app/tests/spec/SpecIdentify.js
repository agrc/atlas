require([
    'app/Identify',

    'stubmodule'

], function(
    ClassUnderTest,

    stubmodule
) {
    describe('app/Identify', function() {
        var testWidget;
        var map;
        var evt = {
            mapPoint: {
                x: 415652.65472246887,
                y: 4447848.04338003,
                toJson: function () {return {};}
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
                testWidget.elevMeters.innerHTML = 'blah';
                testWidget.elevFeet.innerHTML = 'blah';

                testWidget.clearValues();

                expect(testWidget.utmX.innerHTML).toEqual('');
                expect(testWidget.utmY.innerHTML).toEqual('');
                expect(testWidget.lat.innerHTML).toEqual('');
                expect(testWidget.lng.innerHTML).toEqual('');
                expect(testWidget.county.innerHTML).toEqual('');
                expect(testWidget.municipality.innerHTML).toEqual('');
                expect(testWidget.landOwner.innerHTML).toEqual('');
                expect(testWidget.elevMeters.innerHTML).toEqual('');
                expect(testWidget.elevFeet.innerHTML).toEqual('');
            });
        });
        describe('getElevation', function () {
            it('passes the point to the request', function (done) {
                var point = {
                    toJson: function () {return {a: 'a'};}
                };
                var request = jasmine.createSpy('request')
                    .and.returnValue({then: function () {}});
                stubmodule('app/Identify', {
                    'dojo/request': request
                }).then(function (StubbedModule) {
                    var testWidget2 = new StubbedModule({map: map});

                    testWidget2.getElevation(point);

                    expect(request.calls.mostRecent().args[1].query.geometry)
                        .toEqual('{"a":"a"}');

                    done();
                });
            });
        });
    });
});