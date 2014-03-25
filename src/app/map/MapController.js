define([
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/topic',

    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',

    '../config'

], function(
    lang,
    array,
    topic,

    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,

    config
) {
    return {
        // description:
        //      Handles interaction between app widgets and the map. Mostly through pub/sub

        // handles: Object[]
        //      container to track handles for this object
        handles: [],


        // Properties to be sent into constructor
        // map: agrc/widgets/map/BaseMap
        map: null,

        init: function (params) {
            // summary:
            //      description
            console.log('app/MapController::constructor', arguments);

            lang.mixin(this, params);

            this.setUpSubscribes();
        },
        setUpSubscribes: function () {
            // summary:
            //      subscribes to topics
            console.log('app/map/MapController:setUpSubscribes', arguments);
        
            this.handles.push(
                topic.subscribe(config.topics.appMapReferenceLayerToggle.addLayer,
                    lang.hitch(this, 'addReferenceLayer')),
                topic.subscribe(config.topics.appMapReferenceLayerToggle.toggleLayer,
                    lang.hitch(this, 'toggleReferenceLayer'))
            );
        },
        addReferenceLayer: function (url, tiledService, layerIndex, layerProps) {
            // summary:
            //      description
            // layer: esri/layer
            // layerIndex: Number
            console.log('app/map/MapController:addReferenceLayer', arguments);
        
            // check to see if layer has already been added to the map
            var that = this;
            var lyr;
            var alreadyAdded = array.some(this.map.layerIds, function (id) {
                return that.map.getLayer(id).url === url;
            });

            if (!alreadyAdded) {
                var LayerClass = (tiledService) ? ArcGISTiledMapServiceLayer : ArcGISDynamicMapServiceLayer;
                var config = lang.mixin({visible: false}, layerProps);

                lyr = new LayerClass(url, config);

                this.map.addLayer(lyr);
                this.map.addLoaderToLayer(lyr);

                if (layerIndex !== null) {
                    lyr.setVisibleLayers([-1]);
                    lyr.show();
                }
            }
        },
        toggleReferenceLayer: function (url, layerIndex, on) {
            // summary:
            //      toggles a reference layer on the map

            console.log('app/map/MapController:toggleReferenceLayer', arguments);

            var lyr;
            var that = this;
            array.some(this.map.layerIds, function (id) {
                var l = that.map.getLayer(id);
                if (l.url === url) {
                    lyr = l;
                    return true;
                }
            });
        
            if (layerIndex !== null) {
                var visLyrs = lyr.visibleLayers;
                if (on) {
                    visLyrs.push(layerIndex);
                } else {
                    visLyrs.splice(array.indexOf(visLyrs, layerIndex), 1);
                }
                lyr.setVisibleLayers(visLyrs);
            } else {
                var f = (on) ? lyr.show : lyr.hide;
                f.apply(lyr);
            }
        },
        destroy: function () {
            // summary:
            //      destroys all handles
            console.log('app/map/MapControl:destroy', arguments);
        
            array.forEach(this.handles, function (hand) {
                hand.remove();
            });
        }
    };
});