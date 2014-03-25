define([], function () {
    window.AGRC = {
        // app: app.App
        //      global reference to App
        app: null,

        // appName: String
        //      name of the app used in permissionsproxy
        appName: 'deq',

        // version: String
        //      The version number.
        version: '0.0.1',

        // topics: Object
        //      The topic strings used in this app
        topics: {
            appMapReferenceLayerToggle: {
                addLayer: 'app/map/ReferenceLayerToggle.addLayer',
                toggleLayer: 'app/map/ReferenceLayerToggle.toggleLayer'
            }
        },

        // urls: Object
        //      Urls for the project
        urls: {
            UtahPLSS: 'http://mapserv.utah.gov/arcgis/rest/services/UtahPLSS/MapServer',
            DEQEnviro: '/arcgis/rest/services/DEQEnviro/MapServer'
        },

        // layerIndices: Object
        //      Indices of layers within map services.
        layerIndices: {
            landOwnership: 0,
            environmentalCovenants: 1,
            huc: 2,
            indianTribal: 3
        }
    };

    return window.AGRC;
});