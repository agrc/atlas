(function () {
    var projectUrl;
    if (typeof location === 'object') {
        // running in browser
        projectUrl = location.pathname.replace(/\/[^\/]+$/, "");

        // running in unit tests
        projectUrl = (projectUrl === "") ? '/src/' : projectUrl;
    } else {
        // running in build system
        projectUrl = '';
    }
    var components = projectUrl + 'bower_components/';
    var config = {
        packages: [
            {
                name: 'app',
                location: projectUrl + 'app'
            },{
                name: 'agrc',
                location: components + 'agrc-widgets'
            },{
                name: 'ijit',
                location: components + 'agrc-ijit'
            }
        ],
        paths: {
            'use': components + 'use-amd/use',
            'bootstrap': components + 'bootstrap/dist/js/bootstrap',
            'jquery': components + 'jquery/dist/jquery'
        },
        use: {
            'bootstrap': {
                deps: ['jquery']
            }
        }
    };
    require(config, ['app']);
})();