import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types';
import './LayerSelector.css'
import icon from './layers.svg';

class LayerSelectorItem extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    selected: PropTypes.bool.isRequired,
    layerType: PropTypes.oneOf(['baselayer', 'overlay']).isRequired,
    id: PropTypes.string.isRequired
  };

  render() {
    const inputOptions = {
      type: this.props.layerType === 'baselayer' ? 'radio' : 'checkbox',
      name: this.props.layerType,
      value: this.props.id
    };

    return (
      <div className="layer-selector-item radio checkbox">
        <label className="layer-selector--item">
          <input className="layer-selector-item-input" {...inputOptions} checked={this.props.selected} onChange={(event) => this.props.onChange(event, this.props)} />
          {inputOptions.value}
        </label>
      </div>
    )
  }
}

class LayerSelector extends Component {
  constructor(props) {
    super(props);

    if (!this.props.baseLayers || this.props.baseLayers.length < 1) {
      console.warn('layer-selector::`baseLayers` is null or empty. Make sure you have spelled it correctly ' +
        'and are passing it into the constructor of this widget.');

      return;
    }

    const imageryAttributionJsonUrl = 'https://mapserv.utah.gov/cdn/attribution/imagery.json';
    this.applianceLayers = {
      Imagery: {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/utah/\${level}/\${col}/\${row}`,
        hasAttributionData: true,
        attributionDataUrl: imageryAttributionJsonUrl
      },
      Topo: {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/topo_basemap/\${level}/\${col}/\${row}`,
        copyright: 'AGRC'
      },
      Terrain: {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/terrain_basemap/\${level}/\${col}/\${row}`,
        copyright: 'AGRC'
      },
      Lite: {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/lite_basemap/\${level}/\${col}/\${row}`,
        copyright: 'AGRC'
      },
      'Color IR': {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/naip_2011_nrg/\${level}/\${col}/\${row}`,
        copyright: 'AGRC'
      },
      Hybrid: {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/utah/\${level}/\${col}/\${row}`,
        linked: ['Overlay'],
        hasAttributionData: true,
        attributionDataUrl: imageryAttributionJsonUrl
      },
      Overlay: {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/overlay_basemap/\${level}/\${col}/\${row}`
        // no attribution for overlay layers since it just duplicates the base map attribution
      },
      'Address Points': {
        urlPattern: `https://discover.agrc.utah.gov/login/path/${this.props.quadWord}/tiles/address_points_basemap/\${level}/\${col}/\${row}`
      }
    }
    this.managedLayers = {};
    const LOD = this.props.modules[0];
    const TileInfo = this.props.modules[1];
    const WebTiledLayer = this.props.modules[2];
    const Basemap = this.props.modules[3];

    this.props.view.map.basemap = new Basemap();

    const defaultTileInfo = this.createDefaultTileInfo(LOD);
    this.applianceLayers = this.setTileInfosForApplianceLayers(this.applianceLayers, defaultTileInfo, TileInfo);

    this.onItemChanged = this.onItemChanged.bind(this);

    const baseLayers = this.createLayerFactories('baselayer', this.props.baseLayers, WebTiledLayer) || [];

    let hasDefaultSelection = false;
    let defaultSelection = null;
    let hasHybrid = false;
    this.linkedLayers = [];
    baseLayers.forEach(layer => {
      if (layer.selected === true) {
        hasDefaultSelection = true;
        defaultSelection = layer;
      }

      if ((layer.id || layer.token) === 'Hybrid') {
        hasHybrid = true;
      }

      if (layer.linked) {
        this.linkedLayers = this.linkedLayers.concat(layer.linked);
      }
    })

    if (!hasDefaultSelection && baseLayers.length > 0) {
      baseLayers[0].selected = true;
      defaultSelection = baseLayers[0];
    }

    let overlays = this.props.overlays || [];
    if (hasHybrid) {
      overlays.splice(0, 0, 'Overlay');
    }

    overlays = this.createLayerFactories('overlay', overlays, WebTiledLayer) || [];

    if (defaultSelection.linked && defaultSelection.linked.length > 0) {
      overlays.map(layer => {
        if (defaultSelection.linked.includes(layer.id)) {
          layer.selected = true;
        }

        return layer;
      });
    }

    this.state = {
      baseLayers,
      overlays
    };
  }

  static propTypes = {
    view: PropTypes.object.isRequired,
    quadWord: PropTypes.string,
    modules: PropTypes.arrayOf(PropTypes.func).isRequired,
    baseLayers: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.oneOf(['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR', 'Address Points', 'Overlay']),
      PropTypes.shape({
        Factory: PropTypes.func.isRequired,
        urlTemplate: PropTypes.string,
        url: PropTypes.string,
        id: PropTypes.string.isRequired,
        tileInfo: PropTypes.object,
        linked: PropTypes.arrayOf(PropTypes.string)
      }),
      PropTypes.shape({
        token: PropTypes.oneOf(['Hybrid', 'Lite', 'Terrain', 'Topo', 'Color IR', 'Address Points', 'Overlay']).isRequired,
        selected: PropTypes.bool,
        linked: PropTypes.arrayOf(PropTypes.string)
      })
    ])).isRequired,
    overlays: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.oneOf(['Address Points', 'Overlay']),
      PropTypes.shape({
        Factory: PropTypes.func.isRequired,
        urlTemplate: PropTypes.string,
        url: PropTypes.string,
        id: PropTypes.string.isRequired,
        tileInfo: PropTypes.object,
        linked: PropTypes.arrayOf(PropTypes.string)
    })]))
  };

  render() {
    const baseLayers = this.state.baseLayers.map((item, index) => (
      <LayerSelectorItem id={item.name || item.id || 'unknown'} layerType="baselayer" selected={item.selected} onChange={item.onChange} key={index}></LayerSelectorItem>
    ));

    const overlays = this.state.overlays.map(item => (
      <LayerSelectorItem id={item.name || item.id || 'unknown'} layerType="overlay" selected={item.selected} onChange={item.onChange} key={item.id || item}></LayerSelectorItem>
    ));

    return (
      <div className="layer-selector--layers">
        {baseLayers}
        <hr className="layer-selector-separator" />
        {overlays}
      </div>
    )
  }

  /**
 * Creates the default TileInfo constructor object for applicance layers.
 * @private
 * @returns {object} The least common denominator contructor object for appliance layers.
 */
  createDefaultTileInfo(LOD) {
    const tilesize = 256;
    const earthCircumference = 40075016.685568;
    const inchesPerMeter = 39.37;
    const initialResolution = earthCircumference / tilesize;

    const dpi = 96;
    const maxLevel = 20;
    const squared = 2;
    const lods = [];

    for (let level = 0; level <= maxLevel; level++) {
      const resolution = initialResolution / Math.pow(squared, level);
      const scale = resolution * dpi * inchesPerMeter;

      lods.push(new LOD({
        level: level,
        scale: scale,
        resolution: resolution
      }));
    }

    return {
      dpi: dpi,
      size: tilesize,
      origin: {
        x: -20037508.342787,
        y: 20037508.342787
      },
      spatialReference: {
        wkid: 3857
      },
      lods: lods
    };
  }

  /** Sets the TileInfo for each of Discover layers since they all use different levels.
 * @private
 * @param {applianceLayer} layers - The applicance layers object `{ 'id': { urlPattern: ''}}`
 * @returns {applianceLayer} - returns Discover layers object with a new `tileInfo` property.
 */
  setTileInfosForApplianceLayers(layers, defaultTileInfo, TileInfo) {
    const lods = defaultTileInfo.lods;
    const fiveToNineteen = lods.slice(0, 20); // eslint-disable-line no-magic-numbers
    const fiveToSeventeen = lods.slice(0, 18); // eslint-disable-line no-magic-numbers
    const zeroToEighteen = lods.slice(0, 19); // eslint-disable-line no-magic-numbers

    layers.Imagery.tileInfo = new TileInfo(defaultTileInfo);
    layers.Hybrid.tileInfo = new TileInfo(defaultTileInfo);

    let tileInfo = Object.assign({}, defaultTileInfo);
    tileInfo.lods = zeroToEighteen;

    layers['Color IR'].tileInfo = new TileInfo(tileInfo);

    tileInfo = Object.assign({}, defaultTileInfo);
    tileInfo.lods = fiveToSeventeen;

    layers.Topo.tileInfo = new TileInfo(tileInfo);

    tileInfo = Object.assign({}, defaultTileInfo);
    tileInfo.lods = fiveToNineteen;

    layers.Lite.tileInfo = new TileInfo(tileInfo);
    layers.Overlay.tileInfo = new TileInfo(tileInfo);

    return layers;
  }

  /**
 * Takes layer tokens from `applianceLayers` keys and resolves them to `layerFactory` objects with
 * `esri/layer/WebTiledLayer` factories.
 * @private
 * @param {string} layerType - the type of layer `overlay` or `baselayer`.
 * @param {string[]|layerFactory[]} layerFactories - An array of layer tokens or layer factories.
 * @returns {layerFactory[]} an array of resolved layer Factory objects.
 */
  createLayerFactories(layerType, layerFactories, WebTiledLayer) {
    const resolvedInfos = [];
    layerFactories.forEach((li) => {
      if ((typeof li === 'string' || li instanceof String || li.token) ||
        (typeof li.token === 'string' || li.token instanceof String)) {

        const id = (li.token || li);

        if (!this.props.quadWord) {
          console.warn('layer-selector::You chose to use a layer token `' + id + '` without setting ' +
            'your `quadWord` from Discover. The requests for tiles will fail to ' +
            ' authenticate. Pass `quadWord` into the constructor of this widget.');

          return false;
        }

        var layer = this.applianceLayers[id];

        if (!layer) {
          console.warn('layer-selector::The layer token `' + id + '` was not found. Please use one of ' +
            'the supported tokens (' + Object.keys(this.applianceLayers).join(', ') +
            ') or pass in the information on how to create your custom layer ' +
            '(`{Factory, url, id}`).');

          return false;
        }

        const linked = [layer.linked, li.linked].reduce((acc, value, index) => {
          if (value) {
            acc = acc.concat(value);
          }

          if (index === 1 && acc.length === 0) {
            return null;
          }

          return acc;
        }, []);

        resolvedInfos.push({
          Factory: WebTiledLayer,
          urlTemplate: layer.urlPattern,
          linked,
          id,
          selected: !!li.selected,
          copyright: layer.copyright,
          onChange: this.onItemChanged,
          layerType
          // TODO: not supported in 4.x WebTiledLayer
          // hasAttributionData: layer.hasAttributionData,
          // attributionDataUrl: layer.attributionDataUrl,
        });
      } else {
        if (!li.hasOwnProperty('onChange')) {
          li.onChange = this.onItemChanged;
        }

        if (!li.hasOwnProperty('layerType')) {
          li.layerType = layerType;
        }

        if (!li.selected) {
          li.selected = false;
        }

        resolvedInfos.push(li);
      }
    });

    return resolvedInfos;
  }

  componentDidMount() {
    this.updateMap([].concat(this.state.baseLayers).concat(this.state.overlays))
  }

  onItemChanged(event, props) {
    console.log('onItemChanged', props);
    let overlays = this.state.overlays;
    let baseLayers = this.state.baseLayers;

    if (props.layerType === 'baselayer') {
      baseLayers = baseLayers.map(item => {
        item.selected = item.id === props.id ? event.target.checked : false;

        return item;
      });

      const selectedItem = baseLayers.filter((layer) => layer.selected)[0];

      if (selectedItem.linked && selectedItem.linked.length > 0) {
        overlays = overlays.map((item) => {
          if (selectedItem.linked.includes(item.id)) {
            item.selected = true;
          }

          return item;
        });
      } else {
        overlays.map((item) => {
          if (this.linkedLayers.includes(item.id)) {
            item.selected = false;
          }

          return item;
        });
      }
    } else if (props.layerType === 'overlay') {
      overlays.map((item) => {
        if (item.id === props.id) {
          item.selected = event.target.checked;
        }

        return item;
      });
    }

    this.setState({
      overlays,
      baseLayers
    });

    this.updateMap([].concat(baseLayers).concat(overlays))
  }

  updateMap(layerItems) {
    let managedLayers = this.managedLayers;

    layerItems.forEach(layerItem => {
      let layerList = null;
      switch (layerItem.layerType) {
        case 'baselayer':
          if (this.props.view.map.basemap && this.props.view.map.basemap.baseLayers) {
            layerList = this.props.view.map.basemap.baseLayers
          }
          break;
        case 'overlay':
          layerList = this.props.view.map.layers;
          break;
        default:
          break;
      }

      if (layerItem.selected === false) {
        var managedLayer = managedLayers[layerItem.id] || {};
        if (!managedLayer.layer) {
          managedLayer.layer = layerList.getItemAt(layerList.indexOf(layerItem.layer));
        }

        if (managedLayer.layer) {
          layerList.remove(managedLayer.layer);
        }

        return;
      }

      if (Object.keys(managedLayers).indexOf(layerItem.id) < 0) {
        managedLayers[layerItem.id] = {
          layerType: layerItem.layerType
        };
      }

      this.managedLayers = managedLayers;

      if (!managedLayers[layerItem.id].layer) {
        managedLayers[layerItem.id].layer = new layerItem.Factory(layerItem);
      }

      if (layerItem.selected === true) {
        if (!layerList.includes(managedLayers[layerItem.id].layer)) {
          layerList.add(managedLayers[layerItem.id].layer);
        }
      } else {
        layerList.remove(managedLayers[layerItem.id].layer);
      }
    });
  }
}

class LayerSelectorContainer extends Component {
  state = {
    expanded: false
  }

  expand(expand) {
    this.setState({
      expanded: expand
    });
  }

  render() {
    return (
      <div className="layer-selector" onMouseOver={() => this.expand(true)} onMouseOut={() => this.expand(false)} area-haspopup="true">
        <input type="image" className={'layer-selector__toggle ' + (this.state.expanded ? 'layer-selector--hidden' : '')} src={icon} alt="layers" />
        <form className={this.state.expanded ? '' : 'layer-selector--hidden'}>
          {this.props.children}
        </form>
      </div>
    )
  }
}

export { LayerSelectorContainer, LayerSelector }
