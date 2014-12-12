/*global profile:true*/
profile = {
    resourceTags: {
        test: function (mid) {
            return /\/Spec/.test(mid);
        },
        copyOnly: function (filename, mid) {
            return (/^app\/resources\//.test(mid) && !/\.css$/.test(filename));
        },
        amd: function (filename, mid) {
            return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
        },
        miniExclude: function (filename, mid) {
            return mid in {
                'app/package': 1,
                'app/tests/jasmineTestBootstrap': 1
            };
        }
    }
};
