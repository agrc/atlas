define([
    'dojo/parser', 

    'app/App'
], 

function (
    parser
    ) {
    window.AGRC = {
        // errorLogger: ijit.modules.ErrorLogger
        errorLogger: null,

        // app: app.App
        //      global reference to App
        app: null,

        // version: String
        //      The version number.
        version: '2.1.0',

        // apiKey: String
        //      The api key used for services on api.mapserv.utah.gov
        // apiKey: 'AGRC-63E1FF17767822', // localhost
        apiKey: 'AGRC-A94B063C533889', // key for atlas.utah.gov

        // exportWebMapUrl: String
        //      print task url
        exportWebMapUrl: 'http://mapserv.utah.gov/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',

        urls: {
            vector: 'http://mapserv.utah.gov/arcgis/rest/services/BaseMaps/Vector/MapServer'
        }
    };

    // lights...camera...action!
    parser.parse();
});