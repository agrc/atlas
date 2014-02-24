require([
    'app/Wizard',

    'dojo/_base/window',

    'dojo/dom-construct'
], function(
    WidgetUnderTest,

    win,

    domConstruct
) {

    var widget;

    afterEach(function() {
        if (widget) {
            widget.destroy();
            widget = null;
        }
    });

    describe('app/Wizard', function() {
        describe('Sanity', function() {
            beforeEach(function() {
                widget = new WidgetUnderTest(null, domConstruct.create('div', null, win.body()));
            });

            it('should create a Wizard', function() {
                expect(widget).toEqual(jasmine.any(WidgetUnderTest));
            });
        });
    });
});