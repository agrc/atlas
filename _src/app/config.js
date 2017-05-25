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
    esriConfig.defaults.io.corsEnabledServers.push('mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('basemaps.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('api.mapserv.utah.gov');
    esriConfig.defaults.io.corsEnabledServers.push('discover.agrc.utah.gov');

    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version.: String
        //      The version number.
        version: '3.1.1',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        // acquire at developer.mapserv.utah.gov
        apiKey: '',

        // wkt26912: String
        //      The well known text for utm zone 12 nad83 for use with proj4
        /* eslint-disable max-len */
        wkt26912: 'PROJCS["NAD83 / UTM zone 12N",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Transverse_Mercator"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",-111],PARAMETER["scale_factor",0.9996],PARAMETER["false_easting",500000],PARAMETER["false_northing",0],AUTHORITY["EPSG","26912"],AXIS["Easting",EAST],AXIS["Northing",NORTH]]',

        // wkt4326: String
        //      The well known text for wgs 84 (lat/long) for use with proj4
        wkt4326: 'GEOGCS["WGS 84", DATUM["WGS_1984", SPHEROID["WGS 84",6378137,298.257223563, AUTHORITY["EPSG","7030"]], AUTHORITY["EPSG","6326"]], PRIMEM["Greenwich",0, AUTHORITY["EPSG","8901"]], UNIT["degree",0.01745329251994328, AUTHORITY["EPSG","9122"]], AUTHORITY["EPSG","4326"]]',

        // wkt3857: String
        //      The well known text for wgs 84 for use with proj4
        wkt3857: 'PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere",GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Mercator_Auxiliary_Sphere"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",0.0],PARAMETER["Standard_Parallel_1",0.0],PARAMETER["Auxiliary_Sphere_Type",0.0],UNIT["Meter",1.0]]',
        /* eslint-enable max-len */

        urls: {
            search: 'https://api.mapserv.utah.gov/api/v1/search/{0}/{1}',
            reverseGeocode: 'https://api.mapserv.utah.gov/api/v1/geocode/reverse/{0}/{1}',
            landown: 'https://tlamap.trustlands.utah.gov/' +
                     'arcgis/rest/services/SpecialProject/UT_SITLA_LandOwnership_WM/FeatureServer/0',
            printProxy: 'https://mapserv.utah.gov/arcgis/rest/services/PrintProxy/GPServer/PrintProxy',
            exportWebMap: 'https://mapserv.utah.gov/arcgis/rest/services/Utilities/' +
                          'PrintingTools/GPServer/Export%20Web%20Map%20Task'
        },

        fieldNames: {
            // counties & municipalities
            NAME: 'NAME',
            // state
            STATE_LGD: 'STATE_LGD',
            GRID1Mil: 'GRID1Mil',
            GRIS100K: 'GRID100K',
            FEET: 'feet',
            METERS: 'value'
        },

        featureClassNames: {
            counties: 'SGID10.Boundaries.Counties',
            municipalities: 'SGID10.Boundaries.Municipalities',
            landOwnership: 'SGID10.Cadastre.LandOwnership',
            nationalGrid: 'SGID10.Indices.NationalGrid',
            dem: 'SGID10.RASTER.DEM_10METER'
        }
    };

    if (has('agrc-build') === 'prod') {
        // atlas.utah.gov
        window.AGRC.apiKey = 'AGRC-A94B063C533889';
        window.AGRC.quadWord = 'career-exhibit-panel-stadium';
    } else if (has('agrc-build') === 'stage') {
        // test.mapserv.utah.gov
        window.AGRC.quadWord = '';
        window.AGRC.apiKey = 'AGRC-AC122FA9671436';
    } else {
        // localhost
        xhr(require.baseUrl + 'secrets.json', {
            handleAs: 'json',
            sync: true
        }).then(function (secrets) {
            window.AGRC.quadWord = secrets.quadWord;
            window.AGRC.apiKey = secrets.apiKey;
        }, function () {
            throw 'Error getting secrets!';
        });
    }

    return window.AGRC;
});
