(function () {
    var projectUrl;
    if (typeof location === 'object') {
        // running in browser
        projectUrl = location.pathname.replace(/\/[^\/]+$/, "") + '/';

        // running in unit tests
        projectUrl = (projectUrl === "/") ? '/src/' : projectUrl;
    } else {
        // running in build system
        projectUrl = '';
    }
    var components = 'bower_components/';
    var config = {
        packages: [
            {
                name: 'app',
                location: projectUrl + 'app'
            },{
                name: 'agrc',
                location: projectUrl + components + 'agrc-widgets'
            },{
                name: 'ijit',
                location: projectUrl + components + 'agrc-ijit'
            },{
                name: 'bootstrap',
                location: projectUrl + components + 'bootstrap/dist/js',
                main: 'bootstrap'
            }
        ]
    };
    require(config, ['app']);
})();