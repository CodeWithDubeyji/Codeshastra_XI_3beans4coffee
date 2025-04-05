'use client'

import dynamic from 'next/dynamic'
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
const Map = dynamic(() => import('../../components/ui/map'), {
  ssr: false,
})

export default function TripMap() {
  return (
    <Card>
      <CardHeader className="bg-blue-50">
        <CardTitle>Trip Map</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative w-full h-[400px] rounded-md overflow-hidden border">
        
          <div className="absolute inset-0 flex items-center justify-center">
            
            <Map />
            
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

