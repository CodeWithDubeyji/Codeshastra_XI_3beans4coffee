"use client"
import { supabase } from "@/lib/supabaseClient"
import { useEffect } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Users, Share2 } from "lucide-react"
import { motion } from "framer-motion"

export default function Header() {
  const pathname = usePathname()
  const [isloggedIn, setIsLoggedIn] = useState(false)
  
  // Determine which buttons to show based on the current path
  const showCollaborationButton = pathname.includes("/create-trip") || pathname.includes("/itinerary-options")
  const showInviteButton = pathname.includes("/itinerary-details")
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Handle the user data if needed
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

    };
    fetchUser();
  }, []);

  
  return (
    
    <header className="backdrop-blur-xl bg-gradient-to-r from-white/90 to-blue-50/90 sticky top-0 z-50 border-b border-blue-100/30 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3 text-xl transition-all duration-300">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10 text-blue-600 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path 
                d="M12 2L6.5 11L17.5 11L12 2Z" 
                fill="currentColor" 
                fillOpacity="0.9"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              />
              <motion.path 
                d="M17.5 22L17.5 11L6.5 11L6.5 22L17.5 22Z" 
                fill="currentColor" 
                fillOpacity="0.7"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
              <motion.circle
                cx="12"
                cy="16"
                r="1.5"
                fill="white"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              />
            </svg>
            <motion.div 
              className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-blue-400"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            />
          </motion.div>
          <div className="font-light tracking-tight text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent font-medium">Trip</span>
            <span className="font-semibold">Planner</span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4 md:gap-6">
          {showCollaborationButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href="/community">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:bg-blue-100/50 hover:text-blue-700 rounded-full px-5 py-2 transition-all duration-200 font-medium text-sm border border-blue-100/50 hover:border-blue-200"
              >
                <Users className="mr-2 h-4 w-4" />
                Community
              </Button>
              </Link>
            </motion.div>
          )}
          
          {showInviteButton && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:bg-blue-100/50 hover:text-blue-700 rounded-full px-5 py-2 transition-all duration-200 font-medium text-sm border border-blue-100/50 hover:border-blue-200"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </motion.div>
          )}
          
          <nav className="flex items-center gap-2 md:gap-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {isloggedIn && (
                <Link 
                href="/login" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors px-4 py-2 hover:bg-blue-50/50 rounded-full"
              >
                Log In
              </Link>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {isloggedIn && (
                <Link
                href="/signup"
                className="text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-full hover:shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm"
              >
                Sign Up
              </Link>
              )}
              {!isloggedIn && (
                <Link
                href="/signup"
                className="text-sm font-medium bg-gradient-to-r text-red-600 border border-red-600 px-6 py-2.5 rounded-full hover:shadow-md hover:from-border-red-700 hover:to-border-red-600 hover:from-font-light hover:to-font-bold transition-all duration-300 shadow-sm"
              >
                Log out
              </Link>
              )}
            </motion.div>
          </nav>
        </div>
      </div>
    </header>
  )
}