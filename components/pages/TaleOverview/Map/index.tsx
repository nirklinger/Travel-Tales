import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { LngLatLike } from 'maplibre-gl';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { currentTaleIdState, currentTaleStory } from '../../../../states/explore';
import center from '@turf/center';
import { StoryResponse, Tale } from '../../../../types/types';
import { points } from '@turf/helpers';
import bbox from '@turf/bbox';

interface MapProps {
  taleId?: number;
  tale?: Tale;
  story?: StoryResponse;
}

export default function Map({ taleId, tale }: MapProps) {
  // use only loadable or else the map doesn't load
  const storyLoadable = useRecoilValueLoadable(currentTaleStory);
  const story = storyLoadable.valueMaybe();
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
      center: [31, 35],
      zoom: 2,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, []);

  useEffect(() => {
    if (!story) return;

    let centers: number[][] = [];
    const { destinations } = story;

    const sortedDests = destinations
      .filter(destination => destination.geo_location)
      .sort((a, b) => a.first_day - b.first_day);

    const markers = sortedDests.map(dest => {
      const [lat, lng] = dest.geo_location.center;
      centers.push([lat, lng]);
      return new maplibregl.Marker({ color: '#FF0000' }).setLngLat([lat, lng]).addTo(map.current);
    });

    const box = bbox(points(centers));
    map.current.fitBounds(box, {
      padding: { top: 100, bottom: 100, left: 100, right: 100 },
    });

    return () => markers.forEach(marker => marker.remove());
  }, [story]);

  return (
    <div className="relative h-96 w-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
