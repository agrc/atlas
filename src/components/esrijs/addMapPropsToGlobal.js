export default function addMapPropsToGlobal(view) {
  window.mapProps = {};

  view.watch('zoom', newZoom => window.mapProps.zoom = newZoom);
};
