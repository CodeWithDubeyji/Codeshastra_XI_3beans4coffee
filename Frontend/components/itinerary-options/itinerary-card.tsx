"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface Itinerary {
  id: number
  title: string
  subtitle: string
  image: string
  destinations: string
  highlights: string[]
  cost: number
}

interface ItineraryCardProps {
  itinerary: Itinerary
  isSelected: boolean
  onSelect: () => void
  index: number
}

export default function ItineraryCard({ itinerary, isSelected, onSelect, index }: ItineraryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={onSelect}
    >
      <Card
        className={`elegant-card overflow-hidden cursor-pointer transition-all duration-300 ${
          isSelected ? "ring-2 ring-blue-600 ring-offset-2" : ""
        }`}
      >
        <CardHeader className="p-0">
        
          <div className="relative h-48 w-full">
            <div className="relative h-full w-full">
              <Image 
          src="/aleksandrs-karevs-9PZePvYSM4U-unsplash.jpg" 
          alt="Secondary view" 
          fill 
          className="object-cover" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Destinations</h3>
                <p className="text-sm text-gray-500">{itinerary.destinations}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Highlights</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                {itinerary.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Cost</span>
                <span className="font-bold text-xl text-blue-600">${itinerary.cost}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-4">
          <Button
            className={`w-full elegant-button ${
              isSelected
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-blue-600 border border-blue-200 hover:bg-blue-50"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Selected
              </>
            ) : (
              "Select This Itinerary"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

