require([
    'app/_CollapsableMixin'

], function(
    ClassUnderTest
) {

    var testObject;

    afterEach(function() {
        if (testObject) {
            if (testObject.destroy) {
                testObject.destroy();
            }

            testObject = null;
        }
    });

    describe('app/_CollapsableMixin', function() {
        describe('Sanity', function() {
            beforeEach(function() {
                testObject = new ClassUnderTest(null);
            });

            it('should create a _CollapsableMixin', function() {
                expect(testObject).toEqual(jasmine.any(ClassUnderTest));
            });
        });
    });
});