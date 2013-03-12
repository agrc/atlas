/*jshint unused:false, loopfunc:true*/
var dojoConfig = {
    isDebug: false,
    isJasmineTestRunner: true, // prevents parser in main.js from running
    has: {'dojo-undef-api': true}
};

document.write("<script type='text/javascript' src='http://serverapi.arcgisonline.com/jsapi/arcgis/?v=3.3'></script>");

function stubModule(modulePath, stubs, forcedRefreshModules) {
    // inspired by: http://stackoverflow.com/questions/11439540/how-can-i-mock-dependencies-for-unit-testing-in-requirejs
    // and https://github.com/mattfysh/testr.js
    var aliases = [],
        key,
        stubname,
        returnModule,
        clonedAliases;

    require.undef(modulePath);

    // clear out any modules that need to be forced (usually dependencies that use the stubs)
    dojo.forEach(forcedRefreshModules, function (mod) {
        require.undef(mod);
    });

    // add stubs as aliases
    for (key in stubs) {
        if (stubs.hasOwnProperty(key)) {
            // clear any previously cached object for this alias
            require.undef(key);

            stubname = 'STUB_' + key;

            aliases.push([key, stubname]);

            define(stubname, [], function () {
                return stubs[key];
            });
        }
    }

    // clone array because passing it in the require config messes with the values
    clonedAliases = dojo.clone(aliases);

    // get module with stubs
    require({aliases: clonedAliases}, [modulePath], function (Module) {
        returnModule = Module;
    });

    // remove stub aliases
    dojo.forEach(require.aliases, function (al, i) {
        if (dojo.indexOf(clonedAliases, al) !== -1) {
            require.aliases.splice(i, 1);
        }
    });

    // clear cache again
    require.undef(modulePath);
    dojo.forEach(aliases, function (a) {
        require.undef(a[0]);
        require.undef(a[1]);
    });

    return returnModule;
}