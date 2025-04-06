"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

interface Preferences {
  mountain: boolean
  trekking: boolean
  beach: boolean
  adventure: boolean
  cultural: boolean
  [key: string]: boolean
}

interface TripFormProps {
  tripData: {
    source: string
    destination: string
    startDate: string
    endDate: string
    budget: number
    travelers: number
    ageGroup: string
    preferences: Preferences
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

  const [startDate, setStartDate] = useState<Date | undefined>(
    tripData.startDate ? new Date(tripData.startDate) : undefined,
  )

  const [endDate, setEndDate] = useState<Date | undefined>(tripData.endDate ? new Date(tripData.endDate) : undefined)

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    if (date) {
      onTripDataChange("startDate", format(date, "yyyy-MM-dd"))
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    if (date) {
      onTripDataChange("endDate", format(date, "yyyy-MM-dd"))
    }
  }

  const handlePreferenceChange = (preference: string, checked: boolean) => {
    onTripDataChange("preferences", {
      ...tripData.preferences,
      [preference]: checked,
    })
  }

  const incrementTravelers = () => {
    onTripDataChange("travelers", Math.min(10, tripData.travelers + 1))
  }

  const decrementTravelers = () => {
    onTripDataChange("travelers", Math.max(1, tripData.travelers - 1))
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="space-y-3">
          <Label htmlFor="source" className="text-base font-medium">
            Where are you starting from?
          </Label>
          <Input
            id="source"
            placeholder="Enter your starting location"
            className="elegant-input text-lg py-6"
            value={tripData.source}
            onChange={(e) => onTripDataChange("source", e.target.value)}
          />
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <Label htmlFor="destination" className="text-base font-medium">
            Where do you want to go?
          </Label>
          <Input
            id="destination"
            placeholder="Enter your destination"
            className="elegant-input text-lg py-6"
            value={tripData.destination}
            onChange={(e) => onTripDataChange("destination", e.target.value)}
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="space-y-3">
          <Label htmlFor="startDate" className="text-base font-medium">
            Start Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="startDate"
                variant="outline"
                className="elegant-input w-full justify-start text-left font-normal py-6"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span className="text-gray-400">Select start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <Label htmlFor="endDate" className="text-base font-medium">
            End Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="endDate"
                variant="outline"
                className="elegant-input w-full justify-start text-left font-normal py-6"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span className="text-gray-400">Select end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndDateChange}
                initialFocus
                disabled={(date) => date < (startDate || new Date())}
              />
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>

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
          max={10000}
          step={100}
          value={[tripData.budget]}
          onValueChange={(value) => onTripDataChange("budget", value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>$500</span>
          <span>$10,000</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={item} className="space-y-3">
          <Label htmlFor="travelers" className="text-base font-medium">
            Number of Travelers
          </Label>
          <div className="flex items-center">
            <Button type="button" variant="outline" size="icon" onClick={decrementTravelers} className="rounded-full">
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-16 text-center text-lg font-medium">{tripData.travelers}</div>
            <Button type="button" variant="outline" size="icon" onClick={incrementTravelers} className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        <motion.div variants={item} className="space-y-3">
          <Label htmlFor="ageGroup" className="text-base font-medium">
            Age Group
          </Label>
          <Select value={tripData.ageGroup} onValueChange={(value) => onTripDataChange("ageGroup", value)}>
            <SelectTrigger id="ageGroup" className="elegant-input">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="child">Children (0-12)</SelectItem>
              <SelectItem value="teen">Teenagers (13-17)</SelectItem>
              <SelectItem value="adult">Adults (18-64)</SelectItem>
              <SelectItem value="senior">Seniors (65+)</SelectItem>
              <SelectItem value="mixed">Mixed Ages</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      <motion.div variants={item} className="space-y-3">
        <Label className="text-base font-medium">Travel Preferences</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mountain"
              checked={tripData.preferences.mountain}
              onCheckedChange={(checked) => handlePreferenceChange("mountain", checked as boolean)}
            />
            <label
              htmlFor="mountain"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mountains
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="trekking"
              checked={tripData.preferences.trekking}
              onCheckedChange={(checked) => handlePreferenceChange("trekking", checked as boolean)}
            />
            <label
              htmlFor="trekking"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Trekking
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="beach"
              checked={tripData.preferences.beach}
              onCheckedChange={(checked) => handlePreferenceChange("beach", checked as boolean)}
            />
            <label
              htmlFor="beach"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Beaches
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="adventure"
              checked={tripData.preferences.adventure}
              onCheckedChange={(checked) => handlePreferenceChange("adventure", checked as boolean)}
            />
            <label
              htmlFor="adventure"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Adventure
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cultural"
              checked={tripData.preferences.cultural}
              onCheckedChange={(checked) => handlePreferenceChange("cultural", checked as boolean)}
            />
            <label
              htmlFor="cultural"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Cultural
            </label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

