"use client"

import { Map, Calculator, Users, Globe, Compass, CreditCard } from "lucide-react"
import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: "map" | "calculator" | "users" | "globe" | "compass" | "credit-card"
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "map":
        return <Map className="h-6 w-6 text-blue-600" />
      case "calculator":
        return <Calculator className="h-6 w-6 text-blue-600" />
      case "users":
        return <Users className="h-6 w-6 text-blue-600" />
      case "globe":
        return <Globe className="h-6 w-6 text-blue-600" />
      case "compass":
        return <Compass className="h-6 w-6 text-blue-600" />
      case "credit-card":
        return <CreditCard className="h-6 w-6 text-blue-600" />
      default:
        return <Map className="h-6 w-6 text-blue-600" />
    }
  }

  return (
    <motion.div whileHover={{ y: -5 }} className="elegant-card bg-white p-8 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">{getIcon()}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </motion.div>
  )
}

