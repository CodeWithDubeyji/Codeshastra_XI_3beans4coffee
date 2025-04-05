"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"

interface TripFormProps {
  tripData: {
    budget: number
    duration: string
    mood: string
    luxury: string
    destination: string
  }
  onTripDataChange: (field: string, value: any) => void
}

export default function TripForm({ tripData, onTripDataChange }: TripFormProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="space-y-3">
        <Label htmlFor="destination" className="text-base font-medium">
          Where do you want to go?
        </Label>
        <Input
          id="destination"
          placeholder="Enter a destination"
          className="elegant-input text-lg py-6"
          value={tripData.destination}
          onChange={(e) => onTripDataChange("destination", e.target.value)}
        />
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="budget" className="text-base font-medium">
            Budget (USD)
          </Label>
          <span className="text-xl font-semibold text-blue-600">${tripData.budget}</span>
        </div>
        <Slider
          id="budget"
          min={500}
          max={5000}
          step={100}
          value={[tripData.budget]}
          onValueChange={(value) => onTripDataChange("budget", value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>$500</span>
          <span>$5,000</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <Label htmlFor="duration" className="text-base font-medium">
          Trip Duration
        </Label>
        <Select value={tripData.duration} onValueChange={(value) => onTripDataChange("duration", value)}>
          <SelectTrigger id="duration" className="elegant-input">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 days</SelectItem>
            <SelectItem value="5">5 days</SelectItem>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="10">10 days</SelectItem>
            <SelectItem value="14">14 days</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <Label htmlFor="mood" className="text-base font-medium">
          Trip Mood
        </Label>
        <Select value={tripData.mood} onValueChange={(value) => onTripDataChange("mood", value)}>
          <SelectTrigger id="mood" className="elegant-input">
            <SelectValue placeholder="Select mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adventurous">Adventurous</SelectItem>
            <SelectItem value="relaxing">Relaxing</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <Label htmlFor="luxury" className="text-base font-medium">
          Luxury Level
        </Label>
        <Select value={tripData.luxury} onValueChange={(value) => onTripDataChange("luxury", value)}>
          <SelectTrigger id="luxury" className="elegant-input">
            <SelectValue placeholder="Select luxury level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="mid-range">Mid-range</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    </motion.div>
  )
}

