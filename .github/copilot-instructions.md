# Atlas - UGRC Web Mapping Application

> [!NOTE]
> Include our [org-wide instructions](https://github.com/agrc/.github/blob/main/org-copilot-instructions.md) in addition to the project-specific instructions below.

## Overview

Atlas is a React-based web mapping template built with **ArcGIS Maps SDK for JavaScript** and **UGRC (Utah Geospatial Resource Center) components**. It serves as a starting point for Utah-specific web mapping applications, featuring geocoding, identify tools, and integration with Utah-specific data services.

## Technology Stack

- **React 19** with TypeScript (TSX) and legacy JavaScript (JSX) - see note below
- **ArcGIS Maps SDK**: @arcgis/core, @arcgis/map-components (web components), @arcgis/lumina
- **UGRC Libraries**: @ugrc/utah-design-system, @ugrc/utilities, @ugrc/esri-theme-toggle
- **Build Tools**: Vite + pnpm (NOT npm)
- **Styling**: Tailwind CSS with @ugrc/tailwind-preset
- **Testing**: Vitest with happy-dom
- **Analytics**: Firebase (analytics & performance monitoring)

## Architecture

### Map State Management

**MapProvider Context** ([src/components/contexts/MapProvider.tsx](src/components/contexts/MapProvider.tsx)) is the central pattern:

```tsx
// Provides: mapView, setMapView, placeGraphic, zoom
const { mapView, placeGraphic, zoom } = useMap();
```

- All map interactions go through `MapContext`
- `useMap()` hook accesses map state anywhere in component tree
- MapView initialization happens in `MapContainer` via web component callbacks

### ArcGIS Integration Pattern

Uses **ArcGIS Map Components** (web components), not React components:

```tsx
<arcgis-map
  basemap="streets"
  onarcgisViewReadyChange={handleViewReady} // Initialize MapView here
  onarcgisViewClick={onClick}
/>
```

**Critical**: ArcGIS assets must be copied to `public/assets/` via `pnpm run copy:arcgis` after installation. Set `esriConfig.assetsPath = './assets'` in [src/main.tsx](src/main.tsx).

### Coordinate Systems

- **WKID 26912** (UTM Zone 12N, NAD83): Primary Utah projection
- **WKID 3857** (Web Mercator): ArcGIS basemaps
- Use `@arcgis/core/geometry/operators/projectOperator` for transformations

## Development Workflows

### Setup & Running

```bash
pnpm install              # Install dependencies
pnpm run copy:arcgis      # REQUIRED: Copy ArcGIS assets
pnpm start                # Dev server (alias: pnpm dev)
pnpm test                 # Run Vitest tests
pnpm run lint             # ESLint (@ugrc/eslint-config)
pnpm run check            # TypeScript type checking
pnpm run build            # Production build
```

### Environment Variables

Create `.env.local` (NOT committed):

```env
VITE_WEB_API=<api-key>           # UGRC Web API key
VITE_DISCOVER=<quad-word>        # Discover service quad-word
VITE_FIREBASE_CONFIG=<json>      # Firebase config JSON
```

### Branching & Releases

- Feature branches → **dev** → **main**
- `dev` deploys to [atlas.dev.utah.gov](https://atlas.dev.utah.gov)
- `main` deploys to [atlas.utah.gov](https://atlas.utah.gov)

## Key Files & Patterns

### Component Structure

- **[src/main.tsx](src/main.tsx)**: Entry point, Firebase setup, esriConfig
- **[src/App.tsx](src/App.tsx)**: Main app, sidebar/drawer logic, UGRC components (Header, Footer, Sherlock, Geocode)
- **[src/components/MapContainer.tsx](src/components/MapContainer.tsx)**: Map initialization, URL persistence (center, scale, basemap), LayerSelector
- **[src/components/Identify.jsx](src/components/Identify.jsx)**: UGRC API calls for reverse geocoding, feature identification
- **[src/config.ts](src/config.ts)**: App-wide constants (colors, WKIDs, breakpoints)

### UGRC API Integration

Atlas uses **UGRC Web API** services ([src/components/Identify.jsx](src/components/Identify.jsx)):

- `api.mapserv.utah.gov/api/v1/search` - Feature search
- `api.mapserv.utah.gov/api/v1/geocode/reverse` - Reverse geocoding
- Feature classes: `boundaries.county_boundaries`, `cadastre.land_ownership`, `indices.national_grid`

Use `ky` for HTTP requests, always include `apiKey` parameter.

### URL State Persistence

[MapContainer.tsx](src/components/MapContainer.tsx) syncs map state to URL:

```tsx
setUrlParameter<number[]>('center', [x, y]); // Web Mercator coords
setUrlParameter<number>('scale', scale);
setUrlParameter<string>('basemap', 'Lite');
```

Use `getUrlParameter<T>` from `@ugrc/utilities` for initial load.

### Styling Conventions

- **Tailwind CSS** with UGRC preset imported in [tailwind.config.js](tailwind.config.js)
- Include `node_modules/@ugrc/**/*.{tsx,jsx,js}` in Tailwind content paths
- Custom font: `SourceSansPro-Black` for headings
- Use `@ugrc/utah-design-system` components (Header, Footer, Drawer, etc.)

## Special Considerations

### Testing

- Use **happy-dom** environment (Vitest config in [vite.config.ts](vite.config.ts))
- Minimal test coverage currently—expand when adding features
- Run `pnpm test` before committing

### Updating ArcGIS SDK

```bash
pnpm update @arcgis/core @arcgis/lumina @arcgis/map-components
pnpm run copy:arcgis  # CRITICAL: Re-copy assets
```

## Resources

- [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/)
- [ArcGIS Map Components](https://developers.arcgis.com/javascript/latest/components/)
- [UGRC Web API Docs](https://api.mapserv.utah.gov/docs/)
- [UGRC Design System](https://github.com/agrc/kitchen-sink/tree/main/packages/utah-design-system)
