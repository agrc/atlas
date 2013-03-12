(function () {
    var projectUrl;
    if (typeof location === 'object') {
        // running in browser
        projectUrl = location.pathname.replace(/\/[^\/]+$/, "");

        // running in unit tests
        projectUrl = (projectUrl === "") ? '/src' : projectUrl;
    } else {
        // running in build system
        projectUrl = '';
    }
    require({
        packages: [
            {
                name: 'app',
                location: projectUrl + '/app'
            },{
                name: 'agrc',
                location: projectUrl + '/agrc'
            },{
                name: 'ijit',
                location: projectUrl + '/ijit'
            }
        ]
    }, ['app']);
})();