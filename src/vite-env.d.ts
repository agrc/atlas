/// <reference types="@arcgis/map-components/types/react" />
/// <reference types="@esri/calcite-components/types/react" />
/// <reference types="node" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB_API: string;
  readonly VITE_DISCOVER: string;
  readonly VITE_FIREBASE_CONFIG: string;
  readonly PACKAGE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
