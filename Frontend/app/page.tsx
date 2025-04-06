"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import FeatureCard from "@/components/home/feature-card"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <>
      <section className="w-full py-20 md:py-32 overflow-hidden relative">
        {/* Enhanced hero background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-white-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/world-map-dots.svg')] bg-no-repeat bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-400/30 to-transparent mix-blend-overlay"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white drop-shadow-md">
                Plan Your Perfect Journey
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl drop-shadow">
                Create personalized travel itineraries tailored to your preferences, budget, and style.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/create-trip">
                <Button size="lg" className="elegant-button bg-white text-blue-600 hover:bg-blue-50 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  Create a Trip
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="elegant-button bg-transparent border-white text-white hover:bg-white/10 px-8 rounded-full backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Log In
                </Button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 md:mt-24 max-w-5xl mx-auto"
          >
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
              <Image
              src="/radek-skrzypczak-9DlxKGjaVYQ-unsplash.jpg" 
              alt="TripPlanner Dashboard"
              fill
              className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* UI overlay elements */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div>
                <div className="text-white text-xl font-bold mb-1">Plan Your Dream Vacation</div>
                <div className="text-white/80 text-sm">Discover amazing destinations worldwide</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
                <div className="text-blue-600 font-medium">Smart Planning</div>
                <div className="text-gray-500 text-xs">AI-Powered</div>
              </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-block text-blue-600 font-medium px-4 py-1.5 bg-blue-50 rounded-full mb-4"
            >
              Premium Features
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent"
            >
              Designed for Travelers
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-500 md:text-xl max-w-3xl mx-auto"
            >
              Our platform combines powerful planning tools with a beautiful interface to make trip planning enjoyable.
            </motion.p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon="map"
                title="Personalized Itineraries"
                description="Create custom travel plans based on your preferences, budget, and travel style."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon="calculator"
                title="Real-time Cost Estimation"
                description="Get accurate estimates for transportation, lodging, food, and attractions."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <FeatureCard
                icon="users"
                title="Collaborative Planning"
                description="Invite friends and family to collaborate on trip planning in real-time."
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('/images/topography-pattern.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent"></div>
        
        <div className="container px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600 shadow-inner">
                Effortless Planning
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                Focus on the experience, not the logistics
              </h2>
              <p className="text-gray-600 md:text-lg">
                Our intelligent planning system handles the complex details so you can focus on creating memories. From
                budget management to activity scheduling, we've got you covered.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-blue-600 filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart budget allocation across all trip aspects</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-blue-600 filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered recommendations based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-blue-600 filter drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time adjustments and optimization</span>
                </li>
              </ul>
              <div>
                <Link href="/create-trip">
                  <Button className="elegant-button bg-blue-600 text-white hover:bg-blue-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                    Start Planning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <Image
                  src="/axp-photography-GwJJTfS0tMI-unsplash.jpg"
                  alt="Trip Planning"
                  width={600}
                  height={600}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                    <svg
                      xmlns="Frontend\public\axp-photography-GwJJTfS0tMI-unsplash.jpg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Smart Suggestions</div>
                    <div className="text-xs text-gray-500">AI-powered recommendations</div>
                  </div>
                </div>
              </div>
              
              {/* Additional floating elements */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl p-3 shadow-xl border border-gray-100 hidden md:block">
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium">Budget Optimized</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('/images/world-dots.svg')] bg-repeat opacity-5 mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/30 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl"></div>
        
        <div className="container px-4 md:px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6 text-white drop-shadow-md">
              Ready to plan your next adventure?
            </h2>
            <p className="text-blue-100 md:text-xl max-w-2xl mx-auto mb-8">
              Join thousands of travelers who have simplified their trip planning with TripPlanner.
            </p>
            <Link href="/create-trip">
              <Button size="lg" className="elegant-button bg-white text-blue-600 hover:bg-blue-50 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                Get Started for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          
          {/* Social proof */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full">
                <div className="flex items-center gap-1 text-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="ml-1 text-sm">4.9/5 from 2,000+ travelers</span>
                </div>
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full text-white text-sm">
                Featured in Travel Magazine
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <div className="bg-white/10 backdrop-blur-sm px-5 py-3 rounded-full text-white text-sm">
                50,000+ trips planned
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}