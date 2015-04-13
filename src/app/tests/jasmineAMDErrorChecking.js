require(['dojo/domReady!'], function () {
    describe('AMD Loader', function () {
        it('dependencies loaded successfully', function (done) {
            var pause = 100;
            var tries = 1;
            var maxTries = 10;

            var hasProps = function (obj) {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        return true;
                    }
                }
                return false;
            };

            var check = function () {
                console.log('require.waiting', require.waiting);
                if (hasProps(require.waiting)) {
                    // Keep checking until jasmine default timeout.
                    // xstyle/css seems to make this take an extra few milliseconds.
                    if (tries < maxTries) {
                        window.setTimeout(check, pause);
                    } else {
                        expect(require.waiting).toEqual({});
                        done();
                    }
                    tries = tries + 1;
                } else {
                    expect(require.waiting).toEqual({});
                    done();
                }
            };

            check();
        });
    });
});
