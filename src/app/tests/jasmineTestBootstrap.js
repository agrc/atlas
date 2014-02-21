/*jshint unused:false*/
var dojoConfig = {
    isDebug: false,
    isJasmineTestRunner: true, // prevents parser in main.js from running
    has: {'dojo-undef-api': true}
};

// override alert to console
window.alert = function(msg) {
    console.error('ALERT OVERRIDDEN TO LOG: ' + msg);
};