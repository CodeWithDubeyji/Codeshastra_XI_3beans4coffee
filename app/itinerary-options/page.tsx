"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import PageHeader from "@/components/layout/page-header"
import ItineraryCard from "@/components/itinerary-options/itinerary-card"
import { motion } from "framer-motion"

// Sample itinerary data
const itineraries = [
  {
    id: 1,
    title: "Paris & French Riviera",
    subtitle: "7 days • Cultural • Mid-range",
    image: "/placeholder.svg?height=192&width=384",
    destinations: "Paris (4 days), Nice (3 days)",
    highlights: [
      "Eiffel Tower & Louvre Museum",
      "Day trip to Versailles",
      "Mediterranean beaches",
      "Monaco day excursion",
    ],
    cost: 1950,
  },
  {
    id: 2,
    title: "Italian Adventure",
    subtitle: "7 days • Cultural • Mid-range",
    image: "/placeholder.svg?height=192&width=384",
    destinations: "Rome (3 days), Florence (2 days), Venice (2 days)",
    highlights: ["Colosseum & Vatican City", "Uffizi Gallery & Duomo", "Venetian canals", "Authentic Italian cuisine"],
    cost: 2050,
  },
]

export default function ItineraryOptions() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleSelect = (id: number) => {
    setSelectedOption(id)
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <PageHeader title="Choose Your Itinerary" backLink="/create-trip" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 md:grid-cols-2"
        >
          {itineraries.map((itinerary, index) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              isSelected={selectedOption === itinerary.id}
              onSelect={() => handleSelect(itinerary.id)}
              index={index}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex justify-end"
        >
          <Link href={selectedOption ? "/itinerary-details" : "#"}>
            <Button size="lg" className="elegant-button bg-blue-600 hover:bg-blue-700 px-8" disabled={!selectedOption}>
              View Detailed Itinerary
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

