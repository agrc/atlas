// This file is used when the app is an embedded widget in another web site.
// This is the file that loads the widget and it's dependencies.
(function(){
    var server = location.pathname.replace(/\/[^\/]+$/, "");
    if (window.jasmine) {
        server += '/src';
        window.dojoConfig = {
            has: {
                "dojo-undef-api": true,
                isDebug: true
            }
        };
    } else {
        window.dojoConfig = {
            isDebug: true
        };
    }
    // var server = 'http://168.177.223.158/SolarMapWidget';
    
    var head = document.getElementsByTagName('head').item(0);
    
    function loadCss(href){
        // summary:
        //      Adds a css link element to the document head with the 
        //      passed in href
        console.log(this.declaredClass + "::loadCss", arguments);
        
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
        console.log(this.declaredClass + "::loadJavaScript", arguments);
        
        document.write("<script type='text/javascript' src='" + src + "'></script>");
    }
    
    
    // load dojo and agrc css
    loadCss('http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/dojo/dijit/themes/claro/claro.css');
    loadCss('http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/css/esri.css');
    loadCss(server + '/app/resources/App.css');
    
    loadJavaScript('http://serverapi.arcgisonline.com/jsapi/arcgis/3.4');
    loadJavaScript(server + '/app/run.js');
})();