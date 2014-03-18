require([
    'app/App',
    'dojo/dom-construct',
    'dojo/_base/window',
    'dojo/dom-class'

],

function (
    App,
    domConstruct,
    win,
    domClass
    ) {
    describe('app/App', function () {
        var testWidget;
        beforeEach(function () {
            testWidget = new App({}, domConstruct.create('div', {}, win.body()));
            testWidget.startup();
        });
        afterEach(function () {
            testWidget.destroyRecursive();
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

        describe('switchBottomPanel', function () {
            var panel, panel2;
            beforeEach(function () {
                panel = testWidget.identifyPane;
                panel2 = testWidget.resultsGrid;
            });
            it('removes `hidden` class from passed in element', function () {
                domClass.add(panel.domNode, 'hidden');

                testWidget.switchBottomPanel(panel.domNode);

                expect(domClass.contains(panel.domNode, 'hidden')).toBe(false);
            });
            it('adds `hidden` class to the other element', function () {
                domClass.remove(panel.domNode, 'hidden');

                testWidget.switchBottomPanel(panel2);

                expect(domClass.contains(panel.domNode, 'hidden')).toBe(true);
            });
        });
    });
});