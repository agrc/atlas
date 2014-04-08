define([
    'dojo/request',
    'dojo/Deferred'
], function (
    request,
    Deferred
    ) {
    window.AGRC = {
        // app: app.App
        //      global reference to App
        app: null,

        // appName: String
        //      name of the app used in permissionsproxy
        appName: 'deq',

        // version: String
        //      The version number.
        version: '0.1.0',

        // topics: Object
        //      The topic strings used in this app
        topics: {
            appMapReferenceLayerToggle: {
                addLayer: 'app/map/ReferenceLayerToggle.addLayer',
                toggleLayer: 'app/map/ReferenceLayerToggle.toggleLayer'
            },
            appQueryLayer: {
                addLayer: 'app/QueryLayer.addLayer',
                removeLayer: 'app/QueryLayer.removeLayer'
            },
            appMapController: {
                mapZoom: 'app/MapController.mapZoom'
            }
        },

        // urls: Object
        //      Urls for the project
        urls: {
            UtahPLSS: 'http://mapserv.utah.gov/arcgis/rest/services/UtahPLSS/MapServer',
            DEQEnviro: '/arcgis/rest/services/DEQEnviro/MapServer',
            json: '/webdata/DEQEnviro.json'
        },

        // layerIndices: Object
        //      Indices of layers within map services.
        layerIndices: {
            landOwnership: 0,
            environmentalCovenants: 1,
            huc: 2,
            indianTribal: 3
        },

        // queryLayer: Object
        //      query layer properties
        queryLayer: {
            opacity: 0.7,
            color: [4, 241, 90],
            size: 10
        },

        // TRSMinScaleLevel: Number
        //      The minimum scale level that the TRS Layer widget will appear disabled.
        TRSMinScaleLevel: 5,

        // appJson: Object
        //      Cache for data returned by getAppJson
        appJson: null,

        getAppJson: function () {
            // summary:
            //      requests the DEQEnviro.json data and returns it, caches the results for future requests
            console.log('app.config::getAppJson', arguments);

            var def = new Deferred();
        
            if (!this.appJson) {
                request(this.urls.json, {
                    handleAs: 'json'
                }).then(function (json) {
                    def.resolve(this.appJson = json);
                });
            } else {
                def.resolve(this.appJson);
            }

            return def.promise;
        }
    };

    return window.AGRC;
});