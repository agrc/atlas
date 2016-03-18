import FindAddress = require('agrc/widgets/locate/FindAddress');
import MagicZoom = require('agrc/widgets/locate/MagicZoom');
import BaseMap = require('agrc/widgets/map/BaseMap');

import config = require('app/config');
import Identify = require('app/Identify');

import registry = require('dijit/registry');
import _TemplatedMixin = require('dijit/_TemplatedMixin');
import _WidgetBase = require('dijit/_WidgetBase');
import _WidgetsInTemplateMixin = require('dijit/_WidgetsInTemplateMixin');

import dom = require('dojo/dom');
import domStyle = require('dojo/dom-style');
import on = require('dojo/on');
import template = require('dojo/text!app/templates/App.html');
import array = require('dojo/_base/array');
import dojoDeclare = require('dojo/_base/declare');
import lang = require('dojo/_base/lang');

import Print = require('esri/dijit/Print');
import Extent = require('esri/geometry/Extent');

import SideBarToggler = require('ijit/widgets/layout/SideBarToggler');

import BaseMapSelector = require('layer-selector');

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
