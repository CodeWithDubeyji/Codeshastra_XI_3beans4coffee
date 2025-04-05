"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface CostEstimationProps {
  budget: number
}

export default function CostEstimation({ budget }: CostEstimationProps) {
  // Calculate estimated costs based on budget
  const transportationCost = Math.round(budget * 0.3)
  const lodgingCost = Math.round(budget * 0.4)
  const foodCost = Math.round(budget * 0.2)
  const attractionsCost = Math.round(budget * 0.1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="elegant-card bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
          <h3 className="text-lg font-semibold text-white">Estimated Costs</h3>
        </div>
        <CardContent className="p-6">
          <div className="space-y-4">
            <CostItem label="Transportation" amount={transportationCost} />
            <CostItem label="Lodging" amount={lodgingCost} />
            <CostItem label="Food" amount={foodCost} />
            <CostItem label="Attractions" amount={attractionsCost} />

            <div className="pt-4 border-t mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl text-blue-600">${budget}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              These estimates are based on average prices and may vary depending on your specific choices and travel
              dates.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface CostItemProps {
  label: string
  amount: number
}

function CostItem({ label, amount }: CostItemProps) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">${amount}</span>
    </div>
  )
}

