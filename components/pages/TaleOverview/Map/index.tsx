import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { LngLatBoundsLike, LngLatLike } from 'maplibre-gl';
import { useRecoilValueLoadable } from 'recoil';
import { currentTaleStory } from '../../../../states/explore';
import { ParsedDestination, StoryResponse, Tale } from '../../../../types/types';
import { TripDestinations } from '../../../../types/db-schema-definitions';
import { render } from 'react-dom';
import { IonButton, IonHeader } from '@ionic/react';

interface MapProps {
  taleId?: number;
  tale?: Tale;
  story?: StoryResponse;
  viewDestinationInStory: (destination: ParsedDestination) => void;
}

const SOURCE_ID = 'route';

export default function Map({ taleId, tale, viewDestinationInStory }: MapProps) {
  const storyLoadable = useRecoilValueLoadable(currentTaleStory);
  const story = storyLoadable.valueMaybe();
  const mapContainer = useRef(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Function to add the route source and layer
  const addRouteSourceAndLayer = (routeCoordinates: number[][]) => {
    console.log('Adding route source and layer');
    if (map.current && !map.current.getSource(SOURCE_ID)) {
      map.current.addSource(SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates,
          },
        },
      });

      map.current.addLayer({
        id: SOURCE_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#003959',
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });

      // Calculate the bounding box manually
      let minLng = 180;
      let maxLng = -180;
      let minLat = 90;
      let maxLat = -90;

      routeCoordinates.forEach(([lng, lat]) => {
        if (!isNaN(lng) && !isNaN(lat)) {
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        }
      });

      // Fit the map to show all destinations and the route if coordinates are valid
      if (!isNaN(minLng) && !isNaN(minLat) && !isNaN(maxLng) && !isNaN(maxLat)) {
        const bounds: LngLatBoundsLike = [
          [minLng, minLat],
          [maxLng, maxLat],
        ];
        map.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 100, right: 100 },
        });
      } else {
        console.error('Invalid coordinates for fitting the map bounds.');
      }
    }
  };

  useEffect(() => {
    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`,
        center: [31, 35],
        zoom: 2,
      });

      map.current.on('load', () => {
        console.log('Map is fully loaded');
        setIsMapLoaded(true);
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }
  }, [setIsMapLoaded]);

  useEffect(() => {
    if (isMapLoaded && story) {
      console.log('Story and map are loaded');
      const { destinations } = story;

      // Log the story object to check if it contains valid data
      console.log('Story:', story);

      // Log the destinations array to check its contents
      console.log('All Destinations:', destinations);

      // Filter and sort valid destinations with geo_location
      const sortedDests = destinations
        .filter(destination => {
          if (
            destination.geo_location &&
            destination.geo_location.center &&
            !isNaN(destination.geo_location.center[0]) &&
            !isNaN(destination.geo_location.center[1])
          ) {
            return true;
          } else {
            console.warn('Invalid geo_location found:', destination.geo_location);
            return false;
          }
        })
        .sort((a, b) => a.first_day - b.first_day);

      // Log the destinations with geo_location to check if they have valid coordinates
      const destinationsWithGeoLocation = destinations.filter(
        destination => destination.geo_location && destination.geo_location.center
      );
      console.log('Destinations with Geo Location:', destinationsWithGeoLocation);

      // Log the sortedDests array to check if it contains valid destinations
      console.log('Sorted Destinations:', sortedDests);

      // Calculate the route coordinates based on sorted destinations
      const routeCoordinates = sortedDests.map(destination => [
        destination.geo_location.center[0], // Access the longitude from center property
        destination.geo_location.center[1], // Access the latitude from center property
      ]);

      console.log('Route Coordinates:', routeCoordinates);

      if (routeCoordinates.length === 0) {
        console.warn('No valid coordinates found for the route.');
      } else {
        // Call the function to add the route source and layer
        addRouteSourceAndLayer(routeCoordinates);
      }

      // Add markers for each destination on the map
      const markers = sortedDests.map((destination, index) => {
        const { center } = destination.geo_location;
        const tooltip = getDestinationTooltip(destination, viewDestinationInStory);
        return new maplibregl.Marker({
          color: index === 0 ? 'green' : '#008080', //index === sortedDests.length - 1 ? '',
        })
          .setLngLat(center as LngLatLike)
          .setPopup(new maplibregl.Popup().setDOMContent(tooltip))
          .addTo(map.current);
      });

      // Keep this for cleanup the map on unmount
      return () => {
        try {
          map.current.removeLayer(SOURCE_ID);
          map.current.removeSource(SOURCE_ID);
        } catch (err) {}
        markers.forEach(marker => marker.remove());
      };
    }
  }, [isMapLoaded, story, viewDestinationInStory]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}

function getDestinationTooltip(
  destination: ParsedDestination,
  viewDestinationInStory: (destination: ParsedDestination) => void
) {
  const tooltip = (
    <div className={'text-white'}>
      <span className={'text-2xl'}>{destination.name}</span>
      <div className={'cursor-pointer text-sm'}>
        <a onClick={() => viewDestinationInStory(destination)}>view in story</a>
      </div>
    </div>
  );
  const placeholder = document.createElement('div');
  render(tooltip, placeholder);
  return placeholder;
}
