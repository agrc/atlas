define([
    'dojo/text!./templates/Identify.html',

    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/request',
    'dojo/query',

    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',

    'proj4',

    './config'

], function(
    template,

    declare,
    lang,
    array,
    request,
    query,

    _WidgetBase,
    _TemplatedMixin,

    proj4,

    config
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:
        //      Identify functionality for the app. Returns popup with data. Uses the search api for most of the data.

        templateString: template,
        baseClass: 'identify-widget',

        // Properties to be sent into constructor

        // map: esri/map
        map: null,

        constructor: function (params) {
            // summary:
            //      description
            console.log('app/Identify::constructor', arguments);
        
            lang.mixin(this, params);

            this.map.on('click', lang.hitch(this, 'onMapClick'));
            this.map.infoWindow.setTitle('Map Click Information');
            this.map.infoWindow.resize(300, 400);
        },
        postCreate: function () {
            // summary:
            //      description
            console.log('app/Identify:postCreate', arguments);
        
            this.map.infoWindow.setContent(this.domNode);

            this.requests = [
                [
                    config.featureClassNames.counties,
                    config.fieldNames.NAME,
                    this.county,
                    'name' // because the api returns weird field names for now
                ],[
                    config.featureClassNames.municipalities,
                    config.fieldNames.NAME,
                    this.municipality,
                    'name' // because the api returns weird field names for now
                ],[
                    config.featureClassNames.landOwnership,
                    config.fieldNames.STATE_LGD,
                    this.landOwner,
                    'statE_LGD' // because the api returns weird field names for now
                ]
            ];
        },
        onMapClick: function (evt) {
            // summary:
            //      user clicks on the map
            // evt: Map Click Event
            console.log('app/Identify:onMapClick', arguments);

            this.clearValues();
            this.map.infoWindow.show(evt.mapPoint);

            // utm coords 
            this.utmX.innerHTML = Math.round(evt.mapPoint.x);
            this.utmY.innerHTML = Math.round(evt.mapPoint.y);

            // lat/long coords
            var ll = proj4(config.utm12wkt, proj4.WGS84, lang.clone(evt.mapPoint));
            this.lat.innerHTML = Math.round(ll.y * 100000)/100000;
            this.lng.innerHTML = Math.round(ll.x * 100000)/100000;

            array.forEach(this.requests, function (r) {
                var url = lang.replace(config.urls.search, [r[0], r[1]]);
                request(url, {
                    query: {
                        geometry: 'point:' + JSON.stringify([evt.mapPoint.x, evt.mapPoint.y]),
                        apiKey: config.apiKey
                    },
                    headers: {
                        'X-Requested-With': null
                    },
                    handleAs: 'json'
                }).then(function (data) {
                    r[2].innerHTML = (data.result.length > 0) ?
                        data.result[0].attributes[r[3]] : 'n/a';
                });
            });

            this.getElevation(evt.mapPoint);
        },
        clearValues: function () {
            // summary:
            //      clears all of the values for the widget
            console.log('app/Identify:clearValues', arguments);

            query('span', this.domNode).forEach(function (n) {
                n.innerHTML = '';
            });
        },
        getElevation: function (point) {
            // summary:
            //      queries the identify service for the DEM image server
            // point: esri/geometry/Point
            console.log('app/Identify::getElevation', arguments);
        
            var that = this;
            request(config.urls.dem, {
                query: {
                    geometry: JSON.stringify(point.toJson()),
                    f: 'json',
                    geometryType: 'esriGeometryPoint'
                },
                handleAs: 'json',
                headers: {
                    'X-Requested-With': null
                }
            }).then(function (grid) {
                if (grid.value) {
                    var meters = grid.value;
                    var feet = Math.round(meters * 3.28084);
                    that.elevMeters.innerHTML = meters;
                    that.elevFeet.innerHTML = feet;
                }
            });
        }
    });
});