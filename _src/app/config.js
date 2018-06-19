/* jshint maxlen:false */
define([
    'dojo/has',
    'dojo/request/xhr',

    'esri/config'
], function (
    has,
    xhr,

    esriConfig
) {
    // force api to use CORS on mapserv thus removing the test request on app load
    // e.g. http://mapserv.utah.gov/ArcGIS/rest/info?f=json
    esriConfig.request.corsEnabledServers.push('mapserv.utah.gov');
    esriConfig.request.corsEnabledServers.push('api.mapserv.utah.gov');
    esriConfig.request.corsEnabledServers.push('discover.agrc.utah.gov');
    esriConfig.request.corsEnabledServers.push('gis.trustlands.utah.gov');

    if (!has('dojo-built')) {
        esriConfig.workers.loaderConfig = {
            paths: {
                esri: '../arcgis-js-api'
            }
        };
    }

    const config = {
        // app: app.App
        //      global reference to App
        app: null,

        // version.: String
        //      The version number.
        version: '4.0.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        // acquire at developer.mapserv.utah.gov
        apiKey: '',

        minWidthToShowSidebarOnLoad: 624,

        urls: {
            search: 'https://api.mapserv.utah.gov/api/v1/search/{0}/{1}',
            reverseGeocode: 'https://api.mapserv.utah.gov/api/v1/geocode/reverse/{0}/{1}',
            landown: 'https://gis.trustlands.utah.gov/server/' +
                '/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0',
            exportWebMap: 'https://us-central1-utahkoopserver.cloudfunctions.net/printproxy/7' +
                '/arcgis/rest/services/GPServer/export'
        },

        fieldNames: {
            // counties & municipalities
            NAME: 'NAME',
            // state
            STATE_LGD: 'STATE_LGD',
            GRID1Mil: 'GRID1Mil',
            GRIS100K: 'GRID100K',
            FEET: 'feet',
            METERS: 'value',
            ZIP5: 'ZIP5'
        },

        featureClassNames: {
            counties: 'SGID10.BOUNDARIES.Counties',
            municipalities: 'SGID10.BOUNDARIES.Municipalities',
            landOwnership: 'SGID10.CADASTRE.LandOwnership',
            nationalGrid: 'SGID10.INDICES.NationalGrid',
            dem: 'SGID10.RASTER.USGS_DEM_10METER',
            gnis: 'SGID10.LOCATION.PlaceNamesGNIS2010',
            zip: 'SGID10.BOUNDARIES.ZipCodes'
        }
    };

    if (has('agrc-build') === 'prod') {
        // atlas.utah.gov
        config.apiKey = 'AGRC-A94B063C533889';
        config.quadWord = 'career-exhibit-panel-stadium';
    } else if (has('agrc-build') === 'stage') {
        // test.mapserv.utah.gov
        config.quadWord = 'opera-event-little-pinball';
        config.apiKey = 'AGRC-AC122FA9671436';
    } else {
        // localhost
        xhr('secrets.json', {
            handleAs: 'json',
            sync: true
        }).then(function (secrets) {
            config.quadWord = secrets.quadWord;
            config.apiKey = secrets.apiKey;
        }, function () {
            throw 'Error getting secrets!';
        });
    }

    return config;
});
