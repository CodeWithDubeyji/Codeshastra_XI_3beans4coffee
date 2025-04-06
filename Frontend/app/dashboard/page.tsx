"use client"

import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';

const TripDashboard = () => {
  const router = useRouter();
  
  // Sample trip data with images only
  const pastTrips = [
    { id: 1, title: "Past Trip 1", coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop" },
    { id: 2, title: "Past Trip 2", coverImage: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=2036&auto=format&fit=crop" },
    { id: 3, title: "Past Trip 3", coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop" },
    { id: 4, title: "Past Trip 4", coverImage: "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?q=80&w=2070&auto=format&fit=crop" },
  ];
  
  const currentTrips = [
    { id: 5, title: "Current Trip", coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2071&auto=format&fit=crop" },
  ];

  const navigateToScrapbook = (tripId: number) => {
    router.push(`/scrapbook/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-12">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              My Trips
            </h1>
            <p className="text-blue-600/80 text-lg md:text-xl font-light max-w-2xl mx-auto">
              View and relive your travel memories through beautiful images
            </p>
          </div>
          
          {/* Enhanced Tabs */}
          <Tabs defaultValue="past" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-blue-50/50 p-1 rounded-2xl">
              <TabsTrigger 
                value="past" 
                className="text-lg py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-300"
              >
                Past Trips
              </TabsTrigger>
              <TabsTrigger 
                value="current" 
                className="text-lg py-3 rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-300"
              >
                OnGoing Trip
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastTrips.map((trip) => (
                  <Card 
                    key={trip.id}
                    className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group bg-white/80 backdrop-blur-sm"
                    onClick={() => navigateToScrapbook(trip.id)}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={trip.coverImage} 
                        alt={trip.title} 
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                          <h3 className="text-white font-medium text-2xl tracking-wide">
                            {trip.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-white/80">
                            <span className="text-sm">View memories →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="current" className="mt-0">
              <div className="max-w-2xl mx-auto">
                {currentTrips.map((trip) => (
                  <Card 
                    key={trip.id}
                    className="overflow-hidden rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer group bg-white/80 backdrop-blur-sm"
                    onClick={() => navigateToScrapbook(trip.id)}
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={trip.coverImage} 
                        alt={trip.title} 
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-blue-500 rounded-full text-white text-sm font-medium">
                              Active
                            </span>
                          </div>
                          <h3 className="text-white font-medium text-3xl tracking-wide">
                            {trip.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-white/80">
                            <span className="text-sm">Continue your journey →</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;