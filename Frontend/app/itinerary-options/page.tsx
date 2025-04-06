"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import PageHeader from "@/components/layout/page-header"
import ItineraryCard from "@/components/itinerary-options/itinerary-card"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface Itinerary {
  id: number
  title: string
  subtitle: string
  image: string
  destinations: string
  highlights: string[]
  cost: number
  type: "standard" | "budget" | "luxury"
  fullItinerary?: string
}

export default function ItineraryOptions() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    // Load itineraries from localStorage
    const standardItinerary = localStorage.getItem("standardItinerary")
    const budgetItinerary = localStorage.getItem("budgetItinerary")
    const luxuryItinerary = localStorage.getItem("luxuryItinerary")

    // Also store full text versions in session storage for detailed view
    if (localStorage.getItem("standardItineraryRaw")) {
      sessionStorage.setItem("standardItineraryFull", localStorage.getItem("standardItineraryRaw") || "")
    }
    if (localStorage.getItem("budgetItineraryRaw")) {
      sessionStorage.setItem("budgetItineraryFull", localStorage.getItem("budgetItineraryRaw") || "")
    }
    if (localStorage.getItem("luxuryItineraryRaw")) {
      sessionStorage.setItem("luxuryItineraryFull", localStorage.getItem("luxuryItineraryRaw") || "")
    }

    const parsedItineraries: Itinerary[] = []

    try {
      // Parse standard itinerary
      if (standardItinerary) {
        const data = JSON.parse(standardItinerary)
        parsedItineraries.push({
          id: 1,
          title: data.title || "Standard Itinerary",
          subtitle: data.subtitle || "7 days • Balanced • Standard",
          image: "/placeholder.svg?height=192&width=384",
          destinations: data.destination || "Your Destination",
          highlights: data.highlights || [
            "Explore local attractions", 
            "Visit popular landmarks",
            "Experience local cuisine",
            "Cultural activities"
          ],
          cost: data.totalCost || 2000,
          type: "standard",
          fullItinerary: data.fullItinerary
        })
      }

      // Parse budget itinerary
      if (budgetItinerary) {
        const data = JSON.parse(budgetItinerary)
        parsedItineraries.push({
          id: 2,
          title: data.title || "Budget Itinerary",
          subtitle: data.subtitle || "7 days • Value • Budget-friendly",
          image: "/placeholder.svg?height=192&width=384",
          destinations: data.destination || "Your Destination",
          highlights: data.highlights || [
            "Budget accommodations",
            "Free activities",
            "Affordable dining options",
            "Public transportation"
          ],
          cost: data.totalCost || 1400,
          type: "budget",
          fullItinerary: data.fullItinerary
        })
      }

      // Parse luxury itinerary
      if (luxuryItinerary) {
        const data = JSON.parse(luxuryItinerary)
        parsedItineraries.push({
          id: 3,
          title: data.title || "Luxury Itinerary",
          subtitle: data.subtitle || "7 days • Premium • Luxury",
          image: "/placeholder.svg?height=192&width=384",
          destinations: data.destination || "Your Destination",
          highlights: data.highlights || [
            "Premium accommodations",
            "Fine dining experiences",
            "Private tours",
            "Exclusive activities"
          ],
          cost: data.totalCost || 3000,
          type: "luxury",
          fullItinerary: data.fullItinerary
        })
      }
    } catch (e) {
      console.error("Error parsing itineraries", e)
    }

    // If no itineraries were successfully parsed, use fallback data
    if (parsedItineraries.length === 0) {
      setItineraries([
        {
          id: 1,
          title: "Standard Itinerary",
          subtitle: "7 days • Balanced • Standard",
          image: "/placeholder.svg?height=192&width=384",
          destinations: "Your Destination",
          highlights: [
            "Explore local attractions", 
            "Visit popular landmarks",
            "Experience local cuisine",
            "Cultural activities"
          ],
          cost: 2000,
          type: "standard",
        },
        {
          id: 2,
          title: "Budget Itinerary",
          subtitle: "7 days • Value • Budget-friendly",
          image: "/placeholder.svg?height=192&width=384",
          destinations: "Your Destination",
          highlights: [
            "Budget accommodations",
            "Free activities",
            "Affordable dining options",
            "Public transportation"
          ],
          cost: 1400,
          type: "budget",
        },
        {
          id: 3,
          title: "Luxury Itinerary",
          subtitle: "7 days • Premium • Luxury",
          image: "/placeholder.svg?height=192&width=384",
          destinations: "Your Destination",
          highlights: [
            "Premium accommodations",
            "Fine dining experiences",
            "Private tours",
            "Exclusive activities"
          ],
          cost: 3000,
          type: "luxury",
        },
      ])
    } else {
      setItineraries(parsedItineraries)
    }
  }, [])

  const handleSelect = (id: number) => {
    setSelectedOption(id)
    
    // Store selected itinerary for the details page
    const selected = itineraries.find(item => item.id === id);
    if (selected) {
      localStorage.setItem("selectedItinerary", JSON.stringify(selected));
    }
  }

  const filteredItineraries =
    activeTab === "all" ? itineraries : itineraries.filter((itinerary) => itinerary.type === activeTab)

  return (
    <div className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <PageHeader title="Choose Your Itinerary" backLink="/create-trip" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="luxury">Luxury</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItineraries.map((itinerary, index) => (
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

