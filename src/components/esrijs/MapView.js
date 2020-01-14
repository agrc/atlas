import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { loadModules, loadCss } from 'esri-loader';
import { LayerSelectorContainer, LayerSelector } from '@agrc/layer-selector';
import cityExtents from './data/cityExtents.json';


export default class ReactMapView extends Component {
  zoomLevel = 5;
  displayedZoomGraphic = null;
  urls = {
    landownership: 'https://gis.trustlands.utah.gov/server/' +
      '/rest/services/Ownership/UT_SITLA_Ownership_LandOwnership_WM/FeatureServer/0'
  };

  render() {
    return (
      <div
        style={{ height: '100%', width: '100%' }}
        ref={mapViewDiv => {
          this.mapViewDiv = mapViewDiv;
        }}
      />
    );
  }

  async componentDidMount() {
    loadCss('https://js.arcgis.com/4.9/esri/css/main.css');
    const mapRequires = [
      'esri/Map',
      'esri/views/MapView',
      'esri/layers/FeatureLayer',
      'esri/geometry/Polygon'
    ];
    const selectorRequires = [
      'esri/layers/support/LOD',
      'esri/layers/support/TileInfo',
      'esri/layers/WebTileLayer',
      'esri/Basemap'
    ];

    const [Map, MapView, FeatureLayer, Polygon, LOD, TileInfo, WebTileLayer, Basemap] = await loadModules(mapRequires.concat(selectorRequires));

    this.map = new Map();

    // get random city extent
    const randomExtent = cityExtents[Math.round(Math.random() * (cityExtents.length - 1))];
    const extent = new Polygon(randomExtent.geometry).extent;

    this.view = new MapView({
      container: this.mapViewDiv,
      map: this.map,
      extent,
      ui: {
        components: ['zoom']
      }
    });

    this.props.setView(this.view);

    const selectorNode = document.createElement('div');
    this.view.ui.add(selectorNode, 'top-right');

    const layerSelectorOptions = {
      view: this.view,
      quadWord: this.props.discoverKey,
      baseLayers: ['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR'],
      overlays: ['Address Points', {
        Factory: FeatureLayer,
        url: this.urls.landownership,
        id: 'Land Ownership',
        opacity: 0.3
      }],
      modules: { LOD, TileInfo, WebTileLayer, Basemap }
    }

    ReactDOM.render(
      <LayerSelectorContainer>
        <LayerSelector {...layerSelectorOptions}></LayerSelector>
      </LayerSelectorContainer>,
      selectorNode);

    this.view.on('click', this.props.onClick);
  }

  componentDidUpdate(prevProps) {
    const currentGraphic = (((this.props || false).zoomToGraphic || false).graphic || false);
    const previousGraphic = (((prevProps || false).zoomToGraphic || false).graphic || false);

    if (currentGraphic !== previousGraphic && currentGraphic !== false) {
      const { graphic, level, preserve } = this.props.zoomToGraphic;

      this.zoomTo({
        target: graphic,
        zoom: level,
        preserve: preserve
      });
    }
  }

  async zoomTo(zoomObj) {
    console.log('app.zoomTo', arguments);

    if (!Array.isArray(zoomObj.target)) {
      zoomObj.target = [zoomObj.target];
    }

    if (!zoomObj.zoom) {
      if (zoomObj.target.every(graphic => graphic.geometry.type === 'point')) {
        zoomObj = {
          target: zoomObj.target,
          zoom: this.view.map.basemap.baseLayers.items[0].tileInfo.lods.length - this.zoomLevel
        };
      } else {
        zoomObj = {
          target: zoomObj.target
        };
      }
    }

    await this.view.goTo(zoomObj);

    if (this.displayedZoomGraphic) {
      this.view.graphics.removeMany(this.displayedZoomGraphic);
    }

    this.displayedZoomGraphic = zoomObj.target;

    this.view.graphics.addMany(zoomObj.target);

    const [watchUtils] = await loadModules(['esri/core/watchUtils']);

    if (!zoomObj.preserve) {
      watchUtils.once(this.view, 'extent', () => {
        this.view.graphics.removeAll();
      });
    }
  }

  getView() {
    return this.view;
  }
}
