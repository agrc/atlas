require([
    'matchers/Topics',

    'dojo/topic'

], function (
    Topics,

    dojoTopic
    ) {
    describe('matchers/Topics', function () {
        var topicName = 'custom';
        var tObj = {
            t1: 'topic1',
            t2: 'topic2',
            t3: 'topic3'
        };
        describe('listen', function () {
            it('can accept a single topic as a string', function () {
                Topics.listen(topicName);

                dojoTopic.publish(topicName);

                expect(topicName).toHaveBeenPublished();
            });
            it('can accept an object defining multiple topics', function () {
                Topics.listen(tObj);

                dojoTopic.publish(tObj.t1);
                dojoTopic.publish(tObj.t2);

                expect(tObj.t1).toHaveBeenPublished();
                expect(tObj.t2).toHaveBeenPublished();
                expect(tObj.t3).not.toHaveBeenPublished();
            });
        });
        describe('toHaveBeenPublished', function () {
            it('is available as a matcher', function () {
                expect('test').not.toHaveBeenPublished();
            });
            it('subscribes to topics', function () {
                Topics.listen(topicName);

                dojoTopic.publish(topicName);

                expect(topicName).toHaveBeenPublished();
            });
            it('can be used with not', function () {
                expect(topicName).not.toHaveBeenPublished();
            });
        });
        describe('toHaveBeenPublishedWith', function () {
            it('checks arguments', function () {
                var a1 = 'blah';
                var a2 = ['hello', 'world'];

                Topics.listen(topicName);

                dojoTopic.publish(topicName, a1, a2);

                expect(topicName).toHaveBeenPublishedWith(a1, a2);
            });
            it('can be used with not', function () {
                Topics.listen(topicName);

                dojoTopic.publish(topicName, 'blah');

                expect(topicName).not.toHaveBeenPublishedWith('blah2');
            });
            it('returns the most recently published arguments', function () {
                var arg = 'blah3';
                Topics.listen(topicName);

                dojoTopic.publish(topicName, 'blah');
                dojoTopic.publish(topicName, arg);

                expect(topicName).toHaveBeenPublishedWith(arg);

                dojoTopic.publish(topicName, 'hello');

                expect(topicName).not.toHaveBeenPublishedWith(arg);
            });
        });
        describe('toHaveBeenPublishedThisManyTimes', function () {
            beforeEach(function () {
                Topics.listen(topicName);

                dojoTopic.publish(topicName);
                dojoTopic.publish(topicName);
                dojoTopic.publish(topicName);
            });
            it('counts the number of times a topic was published', function () {
                expect(topicName).toHaveBeenPublishedThisManyTimes(3);
            });
            it('can be used with not', function () {
                expect(topicName).not.toHaveBeenPublishedThisManyTimes(2);
            });
        });
    });
});