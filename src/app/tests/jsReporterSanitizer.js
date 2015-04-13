define('app/tests/jsReporterSanitizer', function () {
    // override getJSReport to strip out passing results because
    // sauce chokes if they get too big
    // we only care about failing tests in sauce anyway
    // Sauce supposedly is going to fix this:
    // https://github.com/axemclion/grunt-saucelabs/issues/109#issuecomment-64239913
    var old = jasmine.getJSReport;
    var sanitize = function (obj) {
        if (obj && obj.suites) {
            obj.suites = obj.suites.filter(function (s) {
                return !s.passed;
            }).map(function (s) {
                return sanitize(s);
            });
        }
        return obj;
    };
    jasmine.getJSReport = function () {
        // don't need to worry about scope
        // getJSReport doesn't use `this`
        return sanitize(old());
    };

    return sanitize;
});
