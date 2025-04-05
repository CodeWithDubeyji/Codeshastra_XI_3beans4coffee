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
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-400 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-white">
                Plan Your Perfect Journey
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
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
                <Button size="lg" className="elegant-button bg-white text-blue-600 hover:bg-blue-50 px-8">
                  Create a Trip
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="elegant-button bg-transparent border-white text-white hover:bg-white/10 px-8"
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
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden elegant-shadow">
              <Image
                src="/placeholder.svg?height=1080&width=1920"
                alt="TripPlanner Dashboard"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Designed for Travelers</h2>
            <p className="text-gray-500 md:text-xl max-w-3xl mx-auto">
              Our platform combines powerful planning tools with a beautiful interface to make trip planning enjoyable.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 staggered-fade-in">
            <FeatureCard
              icon="map"
              title="Personalized Itineraries"
              description="Create custom travel plans based on your preferences, budget, and travel style."
            />
            <FeatureCard
              icon="calculator"
              title="Real-time Cost Estimation"
              description="Get accurate estimates for transportation, lodging, food, and attractions."
            />
            <FeatureCard
              icon="users"
              title="Collaborative Planning"
              description="Invite friends and family to collaborate on trip planning in real-time."
            />
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
                Effortless Planning
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Focus on the experience, not the logistics
              </h2>
              <p className="text-gray-500 md:text-lg">
                Our intelligent planning system handles the complex details so you can focus on creating memories. From
                budget management to activity scheduling, we've got you covered.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart budget allocation across all trip aspects</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered recommendations based on your preferences</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Real-time adjustments and optimization</span>
                </li>
              </ul>
              <div>
                <Link href="/create-trip">
                  <Button className="elegant-button bg-blue-600 text-white hover:bg-blue-700">
                    Start Planning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden elegant-shadow">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Trip Planning"
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 elegant-shadow">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
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
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Ready to plan your next adventure?
          </h2>
          <p className="text-gray-500 md:text-xl max-w-2xl mx-auto mb-8">
            Join thousands of travelers who have simplified their trip planning with TripPlanner.
          </p>
          <Link href="/create-trip">
            <Button size="lg" className="elegant-button bg-blue-600 text-white hover:bg-blue-700 px-8">
              Get Started for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}

