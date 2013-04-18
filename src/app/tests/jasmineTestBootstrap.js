/*jshint unused:false*/
var dojoConfig = {
    isDebug: false,
    isJasmineTestRunner: true, // prevents parser in main.js from running
    has: {'dojo-undef-api': true}
};

document.write("<script type='text/javascript' src='http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.4></script>");

// override alert to console
window.alert = function(msg) {
    console.error('ALERT OVERRIDDEN TO LOG: ' + msg);
};