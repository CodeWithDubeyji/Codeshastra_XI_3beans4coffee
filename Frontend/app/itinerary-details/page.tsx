"use client"
import { MessageSquare, Users } from "lucide-react"
import PageHeader from "@/components/layout/page-header"
import ItineraryTimeline from "@/components/itinerary-details/itinerary-timeline"
import ChatInterface from "@/components/itinerary-details/chat-interface"
import TripMap from "@/components/itinerary-details/trip-map"
import TripSummary from "@/components/itinerary-details/trip-summary"
import CollaborationPanel from "@/components/itinerary-details/collaboration-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample itinerary data
const itineraryData = {
  title: "Paris & French Riviera",
  dates: "May 15 - May 21, 2025",
  totalCost: 1950,
  days: [
    {
      id: "day1",
      number: 1,
      title: "Paris Arrival",
      subtitle: "Check-in, Eiffel Tower",
      activities: [
        { time: "9:00 AM", title: "Arrival at Charles de Gaulle Airport", description: "Terminal 2E", cost: null },
        { time: "10:30 AM", title: "Transfer to Hotel", description: "Private shuttle service", cost: 40 },
        { time: "1:00 PM", title: "Hotel Check-in", description: "Hotel de Paris, 4-star accommodation", cost: 180 },
        { time: "3:00 PM", title: "Eiffel Tower Visit", description: "Skip-the-line tickets, summit access", cost: 30 },
        {
          time: "7:00 PM",
          title: "Dinner at Bistro Parisien",
          description: "Seine River view, French cuisine",
          cost: 60,
        },
      ],
    },
    {
      id: "day2",
      number: 2,
      title: "Paris Exploration",
      subtitle: "Louvre, Seine River Cruise",
      activities: [
        { time: "9:00 AM", title: "Breakfast at Hotel", description: "Continental breakfast included", cost: null },
        { time: "10:00 AM", title: "Louvre Museum", description: "Guided tour, 3 hours", cost: 45 },
        { time: "2:00 PM", title: "Lunch at Café Marly", description: "French cuisine with Louvre views", cost: 35 },
        { time: "7:00 PM", title: "Seine River Dinner Cruise", description: "3-course meal, 2-hour cruise", cost: 85 },
      ],
    },
    {
      id: "day3",
      number: 3,
      title: "Versailles Day Trip",
      subtitle: "Palace & Gardens Tour",
      activities: [
        { time: "8:30 AM", title: "Train to Versailles", description: "RER C line from Paris", cost: 8 },
        { time: "10:00 AM", title: "Palace of Versailles Tour", description: "Skip-the-line guided tour", cost: 40 },
        { time: "5:00 PM", title: "Return to Paris", description: "Evening at leisure", cost: 8 },
      ],
    },
    {
      id: "day4",
      number: 4,
      title: "Montmartre & Travel to Nice",
      subtitle: "Sacré-Cœur, Train to Nice",
      activities: [
        { time: "9:00 AM", title: "Montmartre Walking Tour", description: "Sacré-Cœur, Place du Tertre", cost: 25 },
        { time: "2:00 PM", title: "Train to Nice", description: "TGV high-speed train, 5.5 hours", cost: 120 },
        { time: "8:00 PM", title: "Check-in at Nice Hotel", description: "Hotel Negresco, beachfront", cost: 160 },
      ],
    },
    {
      id: "day5",
      number: 5,
      title: "Nice Exploration",
      subtitle: "Old Town, Promenade des Anglais",
      activities: [
        {
          time: "10:00 AM",
          title: "Nice Old Town Tour",
          description: "Markets, architecture, local culture",
          cost: 30,
        },
        {
          time: "3:00 PM",
          title: "Beach Time & Promenade",
          description: "Relaxation on Mediterranean beaches",
          cost: null,
        },
      ],
    },
  ],
  costBreakdown: {
    transportation: 585,
    accommodation: 780,
    activities: 390,
    food: 195,
  },
}

export default function ItineraryDetails() {
  return (
    <div className="py-6">
      <div className="container px-4 md:px-6">
        <PageHeader title={itineraryData.title} backLink="/itinerary-options" />

        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Left side - Itinerary */}
          <div className="space-y-6">
            <ItineraryTimeline days={itineraryData.days} dates={itineraryData.dates} />
            <TripMap />
          </div>

          {/* Right side - Chat & Tools */}
          <div className="space-y-6">
            <Tabs defaultValue="chat">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Trip Assistant
                </TabsTrigger>
                <TabsTrigger value="collaborate">
                  <Users className="h-4 w-4 mr-2" />
                  Collaborate
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-4">
                <ChatInterface />
              </TabsContent>
              <TabsContent value="collaborate" className="mt-4">
                <CollaborationPanel />
              </TabsContent>
            </Tabs>

            <TripSummary
              totalCost={itineraryData.totalCost}
              duration={itineraryData.days.length}
              costBreakdown={itineraryData.costBreakdown}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

