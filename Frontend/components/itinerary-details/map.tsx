'use client';

import {
  GoogleMap,
  LoadScript,
  DirectionsRenderer
} from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface TravelMapProps {
  day: number;
  waypoints: (string | google.maps.DirectionsWaypoint)[];
  origin: string | google.maps.LatLngLiteral;
  destination: string | google.maps.LatLngLiteral;
  travelMode: string;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const TravelMap = ({ day, origin, destination, waypoints, travelMode }: TravelMapProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [duration, setDuration] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [streetViewVisible, setStreetViewVisible] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const geocodeLocation = (input: string): Promise<google.maps.LatLngLiteral | null> => {
    const geocoder = new google.maps.Geocoder();
    return new Promise((resolve) => {
      geocoder.geocode({ address: input }, (results, status) => {
        if (
          status === 'OK' &&
          results &&
          results.length > 0 &&
          results[0].geometry.location_type === 'APPROXIMATE'
        ) {
          const { lat, lng } = results[0].geometry.location;
          resolve({ lat: lat(), lng: lng() });
        } else {
          console.warn(`Geocode failed for ${input}: ${status}`);
          resolve(null);
        }
      });
    });
  };

  const handleMapLoad = async (map: google.maps.Map) => {
    mapRef.current = map;

    const directionsService = new google.maps.DirectionsService();
    const distanceMatrixService = new google.maps.DistanceMatrixService();

    // Convert origin/destination if they are strings
    const resolvedOrigin =
      typeof origin === 'string' ? await geocodeLocation(origin) : origin;

    const resolvedDestination =
      typeof destination === 'string' ? await geocodeLocation(destination) : destination;

    // Convert waypoints if any are strings
    const resolvedWaypoints = await Promise.all(
      waypoints.map(async (wp: any) => {
        if (typeof wp === 'string') {
          const loc = await geocodeLocation(wp);
          return loc ? { location: loc, stopover: true } : null;
        } else if (typeof wp.location === 'string') {
          const loc = await geocodeLocation(wp.location);
          return loc ? { location: loc, stopover: wp.stopover } : null;
        }
        return wp;
      })
    );

    // Filter out failed waypoints
    const filteredWaypoints = resolvedWaypoints.filter(Boolean) as google.maps.DirectionsWaypoint[];

    if (!resolvedOrigin || !resolvedDestination) {
      console.warn('Missing geocoded origin or destination. Aborting route.');
      return;
    }

    directionsService.route(
      {
        origin: resolvedOrigin,
        destination: resolvedDestination,
        waypoints: filteredWaypoints,
        travelMode: travelMode as google.maps.TravelMode,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          setDirections(result);

          const legs = result.routes[0].legs;
          let totalDuration = 0;
          let totalDistance = 0;

          legs.forEach(leg => {
            totalDuration += leg.duration?.value || 0;
            totalDistance += leg.distance?.value || 0;
          });

          setDuration(`${Math.floor(totalDuration / 60)} mins`);
          setDistance(`${(totalDistance / 1000).toFixed(2)} km`);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      }
    );

    // Distance matrix
    distanceMatrixService.getDistanceMatrix(
      {
        origins: [resolvedOrigin],
        destinations: [resolvedDestination],
        travelMode: travelMode as google.maps.TravelMode,
      },
      (response, status) => {
        if (status === 'OK' && response?.rows[0]?.elements[0]?.status === 'OK') {
          console.log('Matrix Estimate:', response.rows[0].elements[0]);
        } else {
          console.warn('Distance Matrix failed:', status);
        }
      }
    );

    // Setup Street View
    const panorama = map.getStreetView();
    panorama.setPosition(resolvedOrigin);
    panorama.setPov({ heading: 165, pitch: 0 });
    panorama.setVisible(streetViewVisible);
    streetViewRef.current = panorama;
  };

  useEffect(() => {
    if (mapRef.current) {
      const panorama = mapRef.current.getStreetView();
      panorama.setVisible(streetViewVisible);
    }
  }, [streetViewVisible]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={['places']}
    >
      <div className="mb-6 border rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-2">Day {day} - Mode: {travelMode}</h2>
        <p className="text-sm text-gray-600 mb-2">
          Total Distance: {distance} | Estimated Time: {duration}
        </p>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 19.0760, lng: 72.8777 }}
          zoom={10}
          onLoad={handleMapLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: false, preserveViewport: false }}
            />
          )}
        </GoogleMap>

        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setStreetViewVisible(prev => !prev)}
        >
          {streetViewVisible ? 'Hide Street View' : 'Show Street View'}
        </Button>
      </div>
    </LoadScript>
  );
};

export default TravelMap;
