import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';
// import './map.css';

interface MapProps {}

export default function Map({}: MapProps) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng] = useState(139.753);
  const [lat] = useState(35.6844);
  const [zoom] = useState(14);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
      center: [lng, lat],
      zoom: zoom,
    });
  }, [lng, lat, zoom]);

  return (
    <div className="relative h-96 w-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
