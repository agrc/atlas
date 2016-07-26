import * as FindAddress from 'agrc/widgets/locate/FindAddress';
import * as MagicZoom from 'agrc/widgets/locate/MagicZoom';
import * as BaseMap from 'agrc/widgets/map/BaseMap';

import * as config from 'app/config';
import * as Identify from 'app/Identify';

import * as registry from 'dijit/registry';
import * as _TemplatedMixin from 'dijit/_TemplatedMixin';
import * as _WidgetBase from 'dijit/_WidgetBase';
import * as _WidgetsInTemplateMixin from 'dijit/_WidgetsInTemplateMixin';

import * as dom from 'dojo/dom';
import * as domStyle from 'dojo/dom-style';
import * as on from 'dojo/on';
import * as template from 'dojo/text!app/templates/App.html';
import * as array from 'dojo/_base/array';
import * as dojoDeclare from 'dojo/_base/declare';
import * as lang from 'dojo/_base/lang';

import * as Print from 'esri/dijit/Print';
import * as Extent from 'esri/geometry/Extent';

import * as SideBarToggler from 'ijit/widgets/layout/SideBarToggler';

import * as BaseMapSelector from 'layer-selector';

export = dojoDeclare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    // summary:
    //      The main widget for the app

    widgetsInTemplate: true,
    templateString: template,
    baseClass: 'app',

    // childWidgets: Object[]
    //      container for holding custom child widgets
    childWidgets: null,

    // map: agrc.widgets.map.Basemap
    map: null,

    constructor: function () {
        // summary:
        //      first function to fire after page loads
        console.info('app.App::constructor', arguments);

        config.app = this;
        this.childWidgets = [];

        this.inherited(arguments);
    },
    postCreate: function () {
        // summary:
        //      Fires when
        console.log('app.App::postCreate', arguments);

        // set version number
        this.version.innerHTML = config.version;

        this.initMap();

        this.childWidgets.push(
            new SideBarToggler({
                sidebar: this.sideBar,
                map: this.map,
                centerContainer: this.centerContainer
            }, this.sidebarToggle),
            new FindAddress({
                map: this.map,
                apiKey: config.apiKey,
                zoomLevel: 17,
                wkid: 3857
            }, this.geocodeNode),
            new MagicZoom({
                map: this.map,
                apiKey: config.apiKey,
                wkid: 3857,
                searchField: 'NAME',
                placeHolder: 'place name...',
                maxResultsToDisplay: 10,
                'class': 'first'
            }, this.gnisNode),
            new MagicZoom({
                map: this.map,
                apiKey: config.apiKey,
                searchLayer: 'SGID10.Boundaries.Municipalities',
                searchField: 'NAME',
                placeHolder: 'city name...',
                wkid: 3857,
                maxResultsToDisplay: 10
            }, this.cityNode),
            this.printer = new Print({
                map: this.map,
                url: config.exportWebMapUrl,
                templates: [{
                    label: 'Portrait (PDF)',
                    format: 'PDF',
                    layout: 'Letter ANSI A Portrait',
                    options: {
                        legendLayers: []
                    }
                }, {
                    label: 'Landscape (PDF)',
                    format: 'PDF',
                    layout: 'Letter ANSI A Landscape',
                    options: {
                        legendLayers: []
                    }
                }]
            }, this.printDiv)
        );

        this.inherited(arguments);

        this.setupConnections();
    },
    setupConnections: function () {
        // summary:
        //      Fires when
        console.log('app.App::setupConnections', arguments);

        on.once(this.egg, 'dblclick', lang.hitch(this, 'showLevel'));
    },
    startup: function () {
        // summary:
        //      Fires after postCreate when all of the child widgets are finished laying out.
        console.log('app.App::startup', arguments);

        var that = this;
        array.forEach(this.childWidgets, function (widget) {
            console.log(widget.declaredClass);
            that.own(widget);
            widget.startup();
        });

        this.printer.on('print-complete', function () {
            domStyle.set(that.popupBlockerBlurb, 'display', 'block');
        });

        this.inherited(arguments);
    },
    showLevel: function () {
        // summary:
        //      shows the current map level
        console.log('app.App::showLevel', arguments);

        var parent = this.egg.parentNode;

        var node = document.createElement('span');
        node.setAttribute('class', 'version');
        node.setAttribute('style', 'padding-right:15px;margin-left:-43px;');
        node.innerHTML = 'level: ' + this.map.getLevel() + ' ';

        parent.insertBefore(node, this.egg.nextSibling);

        this.map.on('extent-change', function _showLevel(changeEvt) {
            node.innerHTML = 'level: ' + changeEvt.lod.level + ' ';
        });
    },
    initMap: function () {
        // summary:
        //      Sets up the map
        console.info('app.App::initMap', arguments);

        this.map = new BaseMap(this.mapDiv, {
            useDefaultBaseMap: false,
            showAttribution: false,
            extent: new Extent({
                xmax: -12010849.397533866,
                xmin: -12898741.918094235,
                ymax: 5224652.298632992,
                ymin: 4422369.249751998,
                spatialReference: {
                    wkid: 3857
                }
            })
        });

        this.childWidgets.push(
            new BaseMapSelector({
                map: this.map,
                quadWord: config.quadWord,
                baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR']
            }),
            new Identify({map: this.map})
        );
    }
});
