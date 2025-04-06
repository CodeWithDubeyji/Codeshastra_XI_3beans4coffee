'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const TravelMap = dynamic(() => import('./map'), { ssr: false })



// const itinerary = selectedIt ? JSON.parse(selectedIt).fullItinerary : null


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
  // interface TravelDay {
  //   day: number;
  //   origin: string;
  //   destination: string;
  //   travelMode: string;
  //   waypoints: { location: string; stopover: boolean }[];
  // }
  
  // const [travelData, setTravelData] = useState<TravelDay[]>([]);
// const fetchItinerary = async () => {
//   try {
   
//     const prompt = `You are a travel itinerary parser. Given a travel plan written in plain English, extract the journey day-wise and return a JSON array in the following format, fully compatible with the Google Maps Directions API::[
//        [
//   {
//     day: 1,
//     origin: 'Mumbai, IN',
//     destination: 'Pune, IN',
//     travelMode: 'DRIVING',
//     waypoints: [
//       { location: 'Lonavala, IN', stopover: true },
//       { location: 'Khandala, IN', stopover: true }
//     ]
//   },
//   {
//     day: 2,
//     origin: 'Pune, IN',
//     destination: 'Mahabaleshwar, IN',
//     travelMode: 'DRIVING',
//     waypoints: [{ location: 'Satara, IN', stopover: true }]
//   },
//   {
//     day: 3,
//     origin: 'Mahabaleshwar, IN',
//     destination: 'Goa, IN',
//     travelMode: 'DRIVING',
//     waypoints: [{ location: 'Kolhapur, IN', stopover: true }]
//   },
//   {
//     day: 4,
//     origin: 'Goa, IN',
//     destination: 'Gokarna, IN',
//     travelMode: 'DRIVING',
//     waypoints: [{ location: 'Karwar, IN', stopover: true }]
//   },
//   {
//     day: 5,
//     origin: 'Gokarna, IN',
//     destination: 'Bengaluru, IN',
//     travelMode: 'DRIVING', // 🔁 Changed from 'TRANSIT' to 'DRIVING'
//     waypoints: [{ location: 'Hubballi, IN', stopover: true }]
//   }
// ],
//       ...
//     ]Rules:

// Always use "DRIVING" as the travelMode (unless stated otherwise).

// If multiple locations are visited between the start and end location on a day, include them as "waypoints" (as strings, in order).

// Format all locations as strings and include country codes (e.g., ", IN").

// Group by day, incrementing by each main itinerary day.

// Do not include unnecessary keys. Keep only: day, origin, destination, travelMode, and waypoints.

// Now, extract and format the following itinerary: ${itinerary} `

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
          
//             "contents": [{
//               "parts":[{"text": prompt}],}]
          
//         })
//       }
//     )

//     if (!response.ok) {
//       throw new Error('Failed to generate standard itinerary')
//     }
//   const currentTrip: TravelDay | undefined = travelData[currentDayIndex];
//     const data = await response.json()
//     console.log('Generated Itinerary:', data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim());
//     setTravelData(JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim()))
//   } catch (error) {
//     console.error('Error fetching itinerary:', error)
//   }
// }
//   const currentTrip = travelData[currentDayIndex]
//   console.log('Current Trip:', currentTrip)

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
  
  const currentTrip = travelData[currentDayIndex]
  return (
   <div> {currentTrip &&(<Card>
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
    </Card>)}</div>
  )
}
