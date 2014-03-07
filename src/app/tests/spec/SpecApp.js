require([
    'app/App',
    'dojo/dom-construct',
    'dojo/_base/window'

],

function (
    App,
    domConstruct,
    win
    ) {
    describe('app/App', function () {
        var testWidget;
        beforeEach(function () {
            testWidget = new App({}, domConstruct.create('div', {}, win.body()));
            testWidget.startup();
        });
        afterEach(function () {
            testWidget.destroy();
            testWidget = null;
        });

        it('creates a valid object', function () {
            expect(testWidget).toEqual(jasmine.any(App));
        });

        describe('buildAnimations', function () {
            it('creates dojo/fx objects', function () {
                testWidget.buildAnimations();

                expect(testWidget.openGridAnimation.play).toBeDefined();
                expect(testWidget.closeGridAnimation.play).toBeDefined();
            });
        });
    });
});