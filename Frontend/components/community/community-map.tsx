"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"

const containerStyle = {
  width: "100%",
  height: "100%",
}

const center = { lat: 20, lng: 0 }

// Sample locations
const locations = [
  { id: 1, name: "Paris", lat: 48.8566, lng: 2.3522, postCount: 124 },
  { id: 2, name: "Tokyo", lat: 35.6762, lng: 139.6503, postCount: 89 },
  { id: 3, name: "New York", lat: 40.7128, lng: -74.006, postCount: 156 },
  { id: 4, name: "Sydney", lat: -33.8688, lng: 151.2093, postCount: 67 },
  { id: 5, name: "Cape Town", lat: -33.9249, lng: 18.4241, postCount: 42 },
]

export default function CommunityMapGoogle() {
  const router = useRouter()
  const [activeMarker, setActiveMarker] = useState<number | null>(null)

  // Load the Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const handleViewCommunity = (locationId: number) => {
    router.push(`/community/${locationId}`)
  }

  if (!isLoaded) return null

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={2}>
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          onClick={() => setActiveMarker(location.id)}
        >
          {activeMarker === location.id && (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div className="p-1 max-w-[200px]">
                <h3 className="font-semibold text-lg">{location.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{location.postCount} posts from travelers</p>
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleViewCommunity(location.id)}
                >
                  View Community
                </Button>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  )
}
