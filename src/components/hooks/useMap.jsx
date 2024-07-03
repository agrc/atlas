import { useContext } from 'react';
import { MapContext } from '../contexts/MapProvider';

export default function useMap() {
  const context = useContext(MapContext);

  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }

  return context;
}
