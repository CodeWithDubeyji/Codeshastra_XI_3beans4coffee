"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import PageHeader from "@/components/layout/page-header"
import TripForm from "@/components/trip-creation/trip-form"
import CostEstimation from "@/components/trip-creation/cost-estimation"
import { motion } from "framer-motion"

export default function CreateTrip() {
  const [tripData, setTripData] = useState({
    budget: 2000,
    duration: "7",
    mood: "balanced",
    luxury: "mid-range",
    destination: "",
  })

  const handleTripDataChange = (field: string, value: any) => {
    setTripData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <PageHeader title="Create Your Trip" backLink="/" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 md:grid-cols-[2fr_1fr]"
        >
          <div className="elegant-card bg-white p-8">
            <TripForm tripData={tripData} onTripDataChange={handleTripDataChange} />
          </div>
          <div>
            <CostEstimation budget={tripData.budget} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex justify-end"
        >
          <Link href="/itinerary-options">
            <Button size="lg" className="elegant-button bg-blue-600 hover:bg-blue-700 px-8">
              Generate Itineraries
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

