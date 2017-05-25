define([
    './config',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/query',
    'dojo/request/xhr',
    'dojo/text!app/templates/Identify.html',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',
    'proj4'
], function (
    config,

    _TemplatedMixin,
    _WidgetBase,

    query,
    request,
    template,
    array,
    declare,
    lang,
    proj4
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

            var width = 300;
            var height = 400;

            this.map.on('click', lang.hitch(this, 'onMapClick'));
            this.map.infoWindow.setTitle('Map Click Information');
            this.map.infoWindow.resize(width, height);
        },
        postCreate: function () {
            // summary:
            //      description
            console.log('app/Identify:postCreate', arguments);

            this.map.infoWindow.setContent(this.domNode);
            var that = this;
            this.requests = [
                [
                    config.featureClassNames.counties,
                    config.fieldNames.NAME,
                    function setCounty(data) {
                        if (!data) {
                            that.county.innerHTML = 'Outside of Utah';

                            return;
                        }
                        that.county.innerHTML = data[config.fieldNames.NAME];
                    }
                ], [
                    config.featureClassNames.municipalities,
                    config.fieldNames.NAME,
                    function setMuni(data) {
                        if (!data) {
                            that.municipality.innerHTML = 'Unincorporated';

                            return;
                        }
                        that.municipality.innerHTML = data[config.fieldNames.NAME];
                    }
                ], [
                    config.featureClassNames.landOwnership,
                    config.fieldNames.STATE_LGD,
                    function setLandowner(data) {
                        if (!data) {
                            that.landOwner.innerHTML = 'Outside of Utah';

                            return;
                        }
                        that.landOwner.innerHTML = data[config.fieldNames.STATE_LGD];
                    }
                ], [
                    config.featureClassNames.nationalGrid,
                    config.fieldNames.GRID1Mil + ',' + config.fieldNames.GRIS100K,
                    function setGrid(data) {
                        if (!data) {
                            that.nationalGrid.innerHTML = 'Outside of Utah';

                            return;
                        }

                        var values = [
                            data[config.fieldNames.GRID1Mil],
                            data[config.fieldNames.GRIS100K], data.x, data.y
                        ];
                        that.nationalGrid.innerHTML = lang.replace('{0} {1} {2} {3}', values);
                    }
                ], [
                    config.featureClassNames.dem,
                    config.fieldNames.FEET + ',' + config.fieldNames.METERS,
                    function setElevation(data) {
                        if (!data) {
                            that.elevFeet.innerHTML = 'Outside of Utah';
                            that.elevMeters.innerHTML = 'Outside of Utah';

                            return;
                        }
                        that.elevFeet.innerHTML = data[config.fieldNames.FEET];
                        that.elevMeters.innerHTML = data[config.fieldNames.METERS];
                    }
                ]
            ];
        },
        onMapClick: function (evt) {
            // summary:
            //      user clicks on the map
            // evt: Map Click Event
            console.log('app/Identify:onMapClick', arguments);

            var that = this;

            this.clearValues();
            this.map.infoWindow.show(evt.mapPoint);

            // lat/long coords
            var ll = proj4(config.wkt3857, config.wkt4326, lang.clone(evt.mapPoint));
            var decimalPlaces = 100000;
            this.lng.innerHTML = Math.round(ll.x * decimalPlaces) / decimalPlaces;
            this.lat.innerHTML = Math.round(ll.y * decimalPlaces) / decimalPlaces;

            // utm coords
            var utm = proj4(config.wkt3857, config.wkt26912, lang.clone(evt.mapPoint));
            var utmx = Math.round(utm.x);
            var utmy = Math.round(utm.y);
            this.utmX.innerHTML = utmx;
            this.utmY.innerHTML = utmy;

            array.forEach(this.requests, function (r) {
                var url = lang.replace(config.urls.search, [r[0], r[1]]);
                request(url, {
                    query: {
                        geometry: 'point:' + JSON.stringify([utmx, utmy]),
                        attributeStyle: 'identical',
                        apiKey: config.apiKey
                    },
                    headers: {
                        'X-Requested-With': null
                    },
                    handleAs: 'json'
                }).then(function (data) {
                    var f;
                    var decimalLength = -5;
                    if (data.result.length > 0) {
                        f = lang.mixin(data.result[0].attributes || [], {
                            x: that.utmX.innerHTML.slice(decimalLength),
                            y: that.utmY.innerHTML.slice(decimalLength)
                        });
                    }
                    r[2](f);
                });
            });

            this.reverseGeocode(utm);
        },
        clearValues: function () {
            // summary:
            //      clears all of the values for the widget
            console.log('app/Identify:clearValues', arguments);

            query('span', this.domNode).forEach(function (n) {
                n.innerHTML = '';
            });
        },
        reverseGeocode: function (point) {
            // summary:
            //      hits the web api reverse geocode endpoint
            // point: esri/geometry/point
            console.log('app/Identify::reverseGeocode', arguments);

            var distanceInMeters = 50;
            var that = this;
            var url = lang.replace(config.urls.reverseGeocode, [point.x, point.y]);
            request(url, {
                query: {
                    apiKey: config.apiKey,
                    distance: distanceInMeters
                },
                headers: {
                    'X-Requested-With': null
                },
                handleAs: 'json'
            }).then(function (data) {
                if (data.status && data.status === 200 && data.result.address) {
                    that.address.innerHTML = data.result.address.street;
                } else {
                    that.address.innerHTML = 'Outside of Utah.';
                }
            });
        }
    });
});
