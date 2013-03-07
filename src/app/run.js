(function () {
    var projectUrl;
    if (typeof location === 'object') {
        // running in browser
        projectUrl = location.pathname.replace(/\/[^\/]+$/, "");
    } else {
        // running in rhino (build system)
        projectUrl = '';
    }
    require({
        packages: [
            {
                name: 'app',
                location: projectUrl + 'app'
            },{
                name: 'agrc',
                location: projectUrl + 'agrc'
            },{
                name: 'ijit',
                location: projectUrl + 'ijit'
            }
        ]
    }, ['app']);
})();