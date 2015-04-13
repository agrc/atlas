require([
    // 'app/tests/jsReporterSanitizer'
], function (
    // jsReporterSanitizer
    ) {
    var jsReporterSanitizer = require('app/tests/jsReporterSanitizer');
    describe('jsReporterSanitizer removes all passed specs and suites', function () {
        it('all specs passing', function () {
            var obj = {
                durationSec: 0.456,
                passed: true,
                suites: [{passed: true}]
            };

            expect(jsReporterSanitizer(obj)).toEqual({
                durationSec: 0.456,
                passed: true,
                suites: []
            });
        });
        it('some failing specs', function () {
            var obj = {
                durationSec: 0.456,
                passed: false,
                suites: [{
                    description: 'blah',
                    passed: false,
                    specs: [],
                    suites: [{
                        description: 'app/map/Legend',
                        failedExpectations: [],
                        specs: [],
                        suites: [{
                            description: 'Sanity',
                            failedExpectations: [],
                            specs: [{
                                description: 'should create a Legend',
                                startTime: 1416855956047,
                                duration: 14,
                                durationSec: 0.014,
                                skipped: false,
                                passed: true,
                                totalCount: 0,
                                passedCount: 1,
                                failedCount: 0,
                                failures: []
                            }],
                            suites: [],
                            passed: true,
                            startTime: 1416855956047,
                            status: 'finished',
                            duration: 61,
                            durationSec: 0.061
                        }],
                        passed: true,
                        startTime: 1416855956047,
                        status: 'finished',
                        duration: 61,
                        durationSec: 0.061
                    }, {
                        description: 'app/map/Print',
                        failedExpectations: [],
                        specs: [],
                        suites: [{
                            description: 'Sanity',
                            failedExpectations: [],
                            specs: [{
                                description: 'should create a Print',
                                startTime: 1416855956475,
                                duration: 109,
                                durationSec: 0.109,
                                skipped: false,
                                passed: true,
                                totalCount: 0,
                                passedCount: 1,
                                failedCount: 0,
                                failures: []
                            }],
                            suites: [],
                            passed: false,
                            startTime: 1416855956475,
                            status: 'finished',
                            duration: 112,
                            durationSec: 0.112
                        }, {
                            description: 'showLoader',
                            failedExpectations: [],
                            specs: [{
                                description: 'disables print button and sets text',
                                startTime: 1416855956587,
                                duration: 51,
                                durationSec: 0.051,
                                skipped: false,
                                passed: true,
                                totalCount: 0,
                                passedCount: 2,
                                failedCount: 0,
                                failures: []
                            }],
                            suites: [],
                            passed: true,
                            startTime: 1416855956587,
                            status: 'finished',
                            duration: 51,
                            durationSec: 0.051
                        }, {
                            description: 'hideLoader',
                            failedExpectations: [],
                            specs: [{
                                description: 'enables button and resets text',
                                startTime: 1416855956638,
                                duration: 60,
                                durationSec: 0.06,
                                skipped: false,
                                passed: true,
                                totalCount: 0,
                                passedCount: 2,
                                failedCount: 0,
                                failures: []
                            }],
                            suites: [],
                            passed: true,
                            startTime: 1416855956638,
                            status: 'finished',
                            duration: 60,
                            durationSec: 0.06
                        }],
                        passed: false,
                        startTime: 1416855956475,
                        status: 'finished',
                        duration: 223,
                        durationSec: 0.223
                    }]
                }]
            };

            expect(jsReporterSanitizer(obj)).toEqual({
                durationSec: 0.456,
                passed: false,
                suites: [{
                    description: 'blah',
                    passed: false,
                    specs: [],
                    suites: [{
                        description: 'app/map/Print',
                        failedExpectations: [],
                        specs: [],
                        suites: [{
                            description: 'Sanity',
                            failedExpectations: [],
                            specs: [{
                                description: 'should create a Print',
                                startTime: 1416855956475,
                                duration: 109,
                                durationSec: 0.109,
                                skipped: false,
                                passed: true,
                                totalCount: 0,
                                passedCount: 1,
                                failedCount: 0,
                                failures: []
                            }],
                            suites: [],
                            passed: false,
                            startTime: 1416855956475,
                            status: 'finished',
                            duration: 112,
                            durationSec: 0.112
                        }],
                        passed: false,
                        startTime: 1416855956475,
                        status: 'finished',
                        duration: 223,
                        durationSec: 0.223
                    }]
                }]
            });
        });
    });
});
