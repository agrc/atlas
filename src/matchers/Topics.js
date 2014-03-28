define([
    'dojo/_base/array',
    'dojo/topic'
], function (
    array,
    topic
    ) {
    var publishes;
    var handles;

    beforeEach(function () {
        publishes = {};
        handles = [];
        jasmine.addMatchers(matchers);
    });

    afterEach(function () {
        array.forEach(handles, function (hand) {
            hand.remove();
        });
    });

    var matchers = {
        toHaveBeenPublished: function () {
            return {
                compare: function (topicName) {
                    var result = {
                        pass: publishes[topicName] !== undefined
                    };

                    // build message
                    var msg = 'Expected topic: "' + topicName + '"';
                    if (result.pass) {
                        msg += ' not';
                    }
                    msg += ' to have been published';

                    result.message = msg;

                    return result;
                }
            };
        },
        toHaveBeenPublishedWith: function (util, customEqualityTesters) {
            return {
                compare: function () {
                    // need to get from arguments keyword because we don't know
                    // how many arguments will be passed
                    // this means that I'm a grown up JS dev :)
                    var topicName = arguments[0];

                    // convert to true array
                    var expectedArgs = [].slice.call(arguments);

                    // remove topicName
                    expectedArgs.splice(0, 1);

                    var actualArgs = publishes[topicName][publishes[topicName].length - 1];
                    var result = {};
                    result.pass = array.every(expectedArgs, function (a, i) {
                        return util.equals(a, actualArgs[i], customEqualityTesters);
                    });

                    // build message
                    var stringify = function (args) {
                        try {
                            return JSON.stringify(args);
                        } catch (e) {
                            return '[could not stringify]';
                        }
                    };
                    var msg = 'Expected topic: "' + topicName + '"\n';
                    if (result.pass) {
                        msg += ' not';
                    }
                    msg += ' to have been called with ' + stringify(expectedArgs) +
                        '\n but it was actually called with ' + stringify(actualArgs);
                    result.message = msg;

                    return result;
                }
            };
        },
        toHaveBeenPublishedThisManyTimes: function () {
            return {
                compare: function (topicName, expectedNumCalls) {
                    var result = {
                        pass: publishes[topicName].length === expectedNumCalls
                    };

                    var msg = 'Expected topic: "' + topicName + '"';
                    if (result.pass) {
                        msg += ' not';
                    }
                    msg += ' to have been published ' + expectedNumCalls + ' times.';
                    result.message = msg;

                    return result;
                }
            };
        }
    };

    return {
        listen: function (topicName) {
            // summary
            //      Adds subscribes for the topic(s) so that this module
            //      can track them.
            // topicName: String | Object
            //      Can either be a single string topic name or an object with
            //      topic names as properties (e.g. {topic1: 'topic1', t2: 'topic2'})
            var topics = [];

            if (typeof topicName === 'string') {
                topics.push(topicName);
            } else {
                for (var prop in topicName) {
                    if (topicName.hasOwnProperty(prop)) {
                        topics.push(topicName[prop]);
                    }
                }
            }
            array.forEach(topics, function (t) {
                handles.push(topic.subscribe(t, function () {
                    if (!publishes[t]) {
                        publishes[t] = [arguments];
                    } else {
                        publishes[t].push(arguments);
                    }
                }));
            });
        },
        matchers: matchers
    };
});