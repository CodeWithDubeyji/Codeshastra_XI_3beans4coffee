'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const TravelMap = dynamic(() => import('./map'), { ssr: false })

const travelData = [
  {
    day: 1,
    origin: 'Mumbai, IN',
    destination: 'Pune, IN',
    travelMode: 'DRIVING',
    waypoints: [
      { location: 'Lonavala, IN', stopover: true },
      { location: 'Khandala, IN', stopover: true }
    ]
  },
  {
    day: 2,
    origin: 'Pune, IN',
    destination: 'Mahabaleshwar, IN',
    travelMode: 'DRIVING',
    waypoints: [{ location: 'Satara, IN', stopover: true }]
  },
  {
    day: 3,
    origin: 'Mahabaleshwar, IN',
    destination: 'Goa, IN',
    travelMode: 'DRIVING',
    waypoints: [{ location: 'Kolhapur, IN', stopover: true }]
  },
  {
    day: 4,
    origin: 'Goa, IN',
    destination: 'Gokarna, IN',
    travelMode: 'DRIVING',
    waypoints: [{ location: 'Karwar, IN', stopover: true }]
  },
  {
    day: 5,
    origin: 'Gokarna, IN',
    destination: 'Bengaluru, IN',
    travelMode: 'DRIVING', // 🔁 Changed from 'TRANSIT' to 'DRIVING'
    waypoints: [{ location: 'Hubballi, IN', stopover: true }]
  }
];


export default function TripMap () {
  const [currentDayIndex, setCurrentDayIndex] = useState(0)
  const currentTrip = travelData[currentDayIndex]

  const handleNext = () => {
    if (currentDayIndex < travelData.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1)
    }
  }

  return (
    <Card>
      <CardHeader className='bg-blue-50'>
        <CardTitle>Trip Map - Day {currentTrip.day}</CardTitle>
      </CardHeader>
      <CardContent className='p-6'>
        <div className='relative w-full h-[460px] rounded-md overflow-hidden border'>
          <TravelMap
            key={currentTrip.day}
            day={currentTrip.day}
            origin={currentTrip.origin}
            destination={currentTrip.destination}
            travelMode={currentTrip.travelMode}
            waypoints={currentTrip.waypoints}
          />
        </div>
        <div className='mt-4 flex justify-between'>
          <Button onClick={handlePrev} disabled={currentDayIndex === 0}>
            Previous
          </Button>
          <span className='text-sm text-gray-600'>
            Day {currentDayIndex + 1} of {travelData.length}
          </span>
          <Button onClick={handleNext} disabled={currentDayIndex === travelData.length - 1}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
