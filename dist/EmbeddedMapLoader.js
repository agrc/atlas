// This file is used when the app is an embedded widget in another web site.
// This is the file that loads the widget and it's dependencies.
(function(){
    var server = location.pathname.replace(/\/[^\/]+$/, "");
    if (window.jasmine) {
        server += '/src';
    } else {
        if (server.indexOf('ParkCityEnviroViewer') === -1) {
            server = 'http://168.177.223.158/ParkCityEnviroViewer/';
        }
        window.dojoConfig = {
            deps: ['app/run']
        };
    }
    
    var head = document.getElementsByTagName('head').item(0);
    
    function loadCss(href){
        // summary:
        //      Adds a css link element to the document head with the 
        //      passed in href
        console.log("loadCss", arguments);
        
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        head.appendChild(link);
    }
    
    function loadJavaScript(src){
        // summary:
        //      Adds a script element to the head with the passed 
        //      in src.
        console.log("loadJavaScript", arguments);
        
        document.write("<script type='text/javascript' src='" + src + "'></script>");
    }
    
    
    // load dojo and agrc css
    loadCss('http://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/dojo/dijit/themes/claro/claro.css');
    loadCss('http://serverapi.arcgisonline.com/jsapi/arcgis/3.5/js/esri/css/esri.css');
    loadCss(server + '/app/resources/App.css');
    
    loadJavaScript(server + '/dojo/dojo.js');
})();