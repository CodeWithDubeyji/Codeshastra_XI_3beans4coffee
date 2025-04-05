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
    { id: 5, title: "Current Trip 1", coverImage: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2071&auto=format&fit=crop" },
    { id: 6, title: "Current Trip 2", coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop" },
  ];

  const navigateToScrapbook = (tripId: number) => {
    router.push(`/scrapbook/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">My Trips</h1>
            <p className="text-blue-600 text-lg max-w-2xl mx-auto">View and relive your travel memories through beautiful images</p>
          </div>
          
          <Tabs defaultValue="past" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="past" className="text-lg py-3">Past Trips</TabsTrigger>
              <TabsTrigger value="current" className="text-lg py-3">Current Trips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="past" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastTrips.map((trip) => (
                  <Card 
                    key={trip.id}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group"
                    onClick={() => navigateToScrapbook(trip.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={trip.coverImage} 
                        alt={trip.title} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-semibold text-xl">{trip.title}</h3>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="current" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTrips.map((trip) => (
                  <Card 
                    key={trip.id}
                    className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group"
                    onClick={() => navigateToScrapbook(trip.id)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={trip.coverImage} 
                        alt={trip.title} 
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-semibold text-xl">{trip.title}</h3>
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