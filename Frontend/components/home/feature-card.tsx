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
    <motion.div
      whileHover={{ y: -5 }}
      className="elegant-card bg-white p-8 flex flex-col items-center text-center rounded-xl shadow-lg relative overflow-hidden backdrop-blur-sm before:absolute before:inset-0 before:bg-gradient-to-br before:from-white before:to-blue-50 before:opacity-80 before:-z-10 border border-blue-100/40"
    >
      {/* Glass morphism effect layers */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-5"></div>
      
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/40 rounded-full blur-2xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>
      
      {/* Accent lines */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400"></div>
      
      {/* Icon container with animated gradient border */}
      <div className="relative p-0.5 rounded-full mb-4 shadow-md group">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 animate-slow-spin"></div>
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center relative z-10">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }} 
            transition={{ type: "spring", stiffness: 300 }}
          >
            {getIcon()}
          </motion.div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-2 relative z-10 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">{title}</h3>
      <p className="text-gray-500 relative z-10">{description}</p>
      
      {/* Interactive highlight effect on hover */}
      <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
    </motion.div>
  )
}