define([
    'app/config',

    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/query',
    'dojo/request/xhr',
    'dojo/text!app/templates/Identify.html',
    'dojo/_base/array',
    'dojo/_base/declare',
    'dojo/_base/lang',

    'esri/geometry/projection',
    'esri/Graphic',
    'esri/symbols/SimpleMarkerSymbol'
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

    projection,
    Graphic,
    SimpleMarkerSymbol
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        // description:
        //      Identify functionality for the app. Returns popup with data. Uses the search api for most of the data.

        templateString: template,
        baseClass: 'identify-widget',

        // Properties to be sent into constructor

        // map: esri/views/MapView
        mapView: null,

        constructor: function (params) {
            // summary:
            //      description
            console.log('app/Identify::constructor', arguments);

            lang.mixin(this, params);

            this.mapView.on('click', this.onMapClick.bind(this));
            this.mapView.popup.title = 'Map Click Information';
        },
        postCreate: function () {
            // summary:
            //      description
            console.log('app/Identify:postCreate', arguments);

            this.mapView.popup.set({
                actions: [],
                content: this.domNode,
                dockEnabled: true,
                dockOptions: {
                    breakpoint: false,
                    buttonEnabled: false
                }
            });

            this.requests = [
                [
                    config.featureClassNames.counties,
                    config.fieldNames.NAME,
                    (data) => {
                        if (!data) {
                            this.county.innerHTML = 'Outside of Utah';

                            return;
                        }
                        this.county.innerHTML = data[config.fieldNames.NAME];
                    }
                ], [
                    config.featureClassNames.municipalities,
                    config.fieldNames.NAME,
                    (data) => {
                        if (!data) {
                            this.municipality.innerHTML = 'Unincorporated';

                            return;
                        }
                        this.municipality.innerHTML = data[config.fieldNames.NAME];
                    }
                ], [
                    config.featureClassNames.landOwnership,
                    config.fieldNames.STATE_LGD,
                    (data) => {
                        if (!data) {
                            this.landOwner.innerHTML = 'Outside of Utah';

                            return;
                        }
                        this.landOwner.innerHTML = data[config.fieldNames.STATE_LGD];
                    }
                ], [
                    config.featureClassNames.nationalGrid,
                    config.fieldNames.GRID1Mil + ',' + config.fieldNames.GRIS100K,
                    (data) => {
                        if (!data) {
                            this.nationalGrid.innerHTML = 'Outside of Utah';

                            return;
                        }

                        var values = [
                            data[config.fieldNames.GRID1Mil],
                            data[config.fieldNames.GRIS100K], data.x, data.y
                        ];
                        this.nationalGrid.innerHTML = lang.replace('{0} {1} {2} {3}', values);
                    }
                ], [
                    config.featureClassNames.dem,
                    config.fieldNames.FEET + ',' + config.fieldNames.METERS,
                    (data) => {
                        if (!data) {
                            this.elevFeet.innerHTML = 'Outside of Utah';
                            this.elevMeters.innerHTML = 'Outside of Utah';

                            return;
                        }
                        this.elevFeet.innerHTML = data[config.fieldNames.FEET];
                        this.elevMeters.innerHTML = data[config.fieldNames.METERS];
                    }
                ], [
                    config.featureClassNames.zip,
                    config.fieldNames.ZIP5,
                    (data) => {
                        if (!data) {
                            this.zip.innerHTML = 'Outside of Utah';

                            return;
                        }

                        this.zip.innerHTML = data[config.fieldNames.ZIP5];
                    }
                ]
            ];
            this.symbol = new SimpleMarkerSymbol({
                style: 'circle',
                size: 10,
                color: '#F012BE' // just for steveoh
            });
        },
        onMapClick: function (evt) {
            // summary:
            //      user clicks on the map
            // evt: Map Click Event
            //
            // returns: Promise || null
            console.log('app/Identify:onMapClick', arguments);

            let promise = null;

            evt.stopPropagation();

            this.clearValues();

            this.mapView.graphics.add(new Graphic({
                symbol: this.symbol,
                geometry: evt.mapPoint
            }));

            this.mapView.popup.open({
                location: evt.mapPoint
            });

            if (projection.isSupported()) {
                promise = projection.load().then(() => {
                    // lat/long coords
                    const ll = projection.project(evt.mapPoint, { wkid: 4326 });
                    const decimalPlaces = 100000;
                    this.lng.innerHTML = Math.round(ll.x * decimalPlaces) / decimalPlaces;
                    this.lat.innerHTML = Math.round(ll.y * decimalPlaces) / decimalPlaces;

                    // utm coords
                    const utm = projection.project(evt.mapPoint, { wkid: 26912 });
                    const utmx = Math.round(utm.x);
                    const utmy = Math.round(utm.y);
                    this.utmX.innerHTML = utmx;
                    this.utmY.innerHTML = utmy;

                    this.googleMapsLink.href = `https://www.google.com/maps?q&layer=c&cbll=${ll.y},${ll.x}`;
                });
            }

            array.forEach(this.requests, (r) => {
                var url = lang.replace(config.urls.search, [r[0], r[1]]);
                request(url, {
                    query: {
                        geometry: `point: ${JSON.stringify(evt.mapPoint.toJSON())}`,
                        attributeStyle: 'identical',
                        apiKey: config.apiKey,
                        spatialReference: 3857
                    },
                    headers: {
                        'X-Requested-With': null
                    },
                    handleAs: 'json'
                }).then((data) => {
                    var f;
                    var decimalLength = -5;
                    if (data.result.length > 0) {
                        f = lang.mixin(data.result[0].attributes || [], {
                            x: this.utmX.innerHTML.slice(decimalLength),
                            y: this.utmY.innerHTML.slice(decimalLength)
                        });
                    }
                    r[2](f);
                });
            });

            this.reverseGeocode(evt.mapPoint);

            return promise;
        },
        clearValues: function () {
            // summary:
            //      clears all of the values for the widget
            console.log('app/Identify:clearValues', arguments);

            this.mapView.graphics.removeAll();

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
                    distance: distanceInMeters,
                    spatialReference: 3857
                },
                headers: {
                    'X-Requested-With': null
                },
                handleAs: 'json'
            }).then(function (data) {
                if (data.status && data.status === 200 && data.result.address) {
                    that.address.innerHTML = data.result.address.street;
                } else {
                    that.address.innerHTML = 'Not found.';
                }
            });
        }
    });
});
