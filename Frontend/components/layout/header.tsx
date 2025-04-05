"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Share2 } from "lucide-react"
import { motion } from "framer-motion"

export default function Header() {
  const pathname = usePathname()

  // Determine which buttons to show based on the current path
  const showCollaborationButton = pathname.includes("/create-trip") || pathname.includes("/itinerary-options")
  const showInviteButton = pathname.includes("/itinerary-details")

  return (
    <header className="border-b border-gray-100 backdrop-blur-md bg-white/80 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-blue-600 flex items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 mr-2 text-blue-600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L6.5 11L17.5 11L12 2Z" fill="currentColor" fillOpacity="0.8" />
              <path d="M17.5 22L17.5 11L6.5 11L6.5 22L17.5 22Z" fill="currentColor" fillOpacity="0.6" />
            </svg>
          </motion.div>
          TripPlanner
        </Link>
        <div className="flex items-center gap-4">
          {showCollaborationButton && (
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <Users className="mr-2 h-4 w-4" />
              Join Others' Trips
            </Button>
          )}
          {showInviteButton && (
            <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <Share2 className="mr-2 h-4 w-4" />
              Invite to Collaborate
            </Button>
          )}
          <nav className="flex gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

