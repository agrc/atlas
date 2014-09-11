require(['dojo/domReady!'], function () {
    describe('AMD Loader', function () {
        it('dependencies loaded successfully', function () {
            expect(require.waiting).toEqual({});
        });
    });
});