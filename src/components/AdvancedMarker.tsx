import { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';

interface AdvancedMarkerProps {
  map: google.maps.Map | null;
  position: google.maps.LatLngLiteral;
  children?: React.ReactNode;
  onClick?: () => void;
  title?: string;
  zIndex?: number;
}

const AdvancedMarker = ({ map, position, children, onClick, title, zIndex }: AdvancedMarkerProps) => {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const rootRef = useRef<Root | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!map || !google.maps.marker?.AdvancedMarkerElement) return;

    // Create container for React content
    const container = document.createElement('div');
    containerRef.current = container;
    
    // Create marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map,
      position,
      title,
      zIndex,
      content: children ? container : undefined,
    });

    markerRef.current = marker;

    const listener = marker.addListener('click', () => {
      if (onClick) onClick();
    });

    return () => {
      if (listener) listener.remove();
      marker.map = null;
      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }
    };
  }, [map]);

  // Update position if it changes
  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.position = position;
    }
  }, [position]);

  // Update content if children change
  useEffect(() => {
    if (children && containerRef.current) {
      if (!rootRef.current) {
        rootRef.current = createRoot(containerRef.current);
      }
      rootRef.current.render(children);
      if (markerRef.current) {
        markerRef.current.content = containerRef.current;
      }
    } else if (!children && markerRef.current) {
       // Reset to default marker if children are removed
       markerRef.current.content = null; 
    }
  }, [children]);

  return null;
};

export default AdvancedMarker;
