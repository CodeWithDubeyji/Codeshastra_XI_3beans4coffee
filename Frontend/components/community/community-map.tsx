"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Icon } from "leaflet"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

// Fix for default marker icon in Leaflet with Next.js
const markerIcon = new Icon({
  iconUrl: "/marker-icon.png",
  iconRetinaUrl: "/marker-icon-2x.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Sample locations data - in a real app, this would come from an API
const locations = [
  { id: 1, name: "Paris", lat: 48.8566, lng: 2.3522, postCount: 124 },
  { id: 2, name: "Tokyo", lat: 35.6762, lng: 139.6503, postCount: 89 },
  { id: 3, name: "New York", lat: 40.7128, lng: -74.006, postCount: 156 },
  { id: 4, name: "Sydney", lat: -33.8688, lng: 151.2093, postCount: 67 },
  { id: 5, name: "Cape Town", lat: -33.9249, lng: 18.4241, postCount: 42 },
]

export default function CommunityMap() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Load marker icons
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    document.head.appendChild(link)
  }, [])

  const handleViewCommunity = (locationId: number) => {
    router.push(`/community/${locationId}`)
  }

  if (!isMounted) return null

  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }} className="z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {locations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lng]} icon={markerIcon}>
          <Popup>
            <div className="p-1">
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
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

