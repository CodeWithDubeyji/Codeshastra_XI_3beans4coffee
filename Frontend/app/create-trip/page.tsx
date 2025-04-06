'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Loader2 } from 'lucide-react'
import PageHeader from '@/components/layout/page-header'
import TripForm from '@/components/trip-creation/trip-form'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface Preferences {
  mountain: boolean
  trekking: boolean
  beach: boolean
  adventure: boolean
  cultural: boolean
  [key: string]: boolean
}

export default function CreateTrip() {
  const router = useRouter()
  const { toast } = useToast()

  const [tripData, setTripData] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: 2000,
    travelers: 1,
    ageGroup: 'adult',
    preferences: {
      mountain: false,
      trekking: false,
      beach: false,
      adventure: false,
      cultural: false
    } as Preferences
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [firstResponse, setFirstResponse] = useState('')
  const [secondResponse, setSecondResponse] = useState('')
  const [thirdResponse, setThirdResponse] = useState('')

  const handleTripDataChange = (field: string, value: any) => {
    setTripData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Create structured data from text response
  const createStructuredData = (text: string, type: 'standard' | 'budget' | 'luxury') => {
    // Extract trip duration in days
    const daysMatch = text.match(/(\d+)\s*days?/i);
    const days = daysMatch ? parseInt(daysMatch[1]) : 7;
    
    // Generate a title based on destination and type
    let title = `${tripData.destination} Trip`;
    if (type === 'budget') {
      title = `Budget ${tripData.destination} Trip`;
    } else if (type === 'luxury') {
      title = `Luxury ${tripData.destination} Experience`;
    }
    
    // Generate a subtitle
    let subtitle = `${days} days`;
    if (type === 'standard') {
      subtitle += ' • Balanced • Standard';
    } else if (type === 'budget') {
      subtitle += ' • Value • Budget-friendly';
    } else if (type === 'luxury') {
      subtitle += ' • Premium • Luxury';
    }
    
    // Extract cost/budget
    let cost = tripData.budget;
    if (type === 'budget') {
      cost = Math.round(tripData.budget * 0.7);
    } else if (type === 'luxury') {
      cost = Math.round(tripData.budget * 1.5);
    }
    
    // Try to extract highlights from the text
    const highlights: string[] = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length && highlights.length < 4; i++) {
      const line = lines[i].trim();
      // Look for bullet points or numbered items that could be attractions or activities
      if ((line.startsWith('- ') || line.startsWith('• ') || line.match(/^\d+\.\s/)) && 
          line.length > 5 && line.length < 80) {
        // Clean up the highlight text
        let highlight = line.replace(/^[-•\d\.]\s*/, '').trim();
        // Truncate if too long
        if (highlight.length > 50) {
          highlight = highlight.substring(0, 47) + '...';
        }
        highlights.push(highlight);
      }
    }
    
    // If we couldn't extract highlights, provide some defaults
    if (highlights.length === 0) {
      if (type === 'standard') {
        highlights.push(
          `Visit ${tripData.destination} attractions`,
          'Local culture exploration',
          'Dining experiences',
          'Sightseeing tours'
        );
      } else if (type === 'budget') {
        highlights.push(
          'Free walking tours',
          'Budget accommodations',
          'Local street food',
          'Public transportation'
        );
      } else if (type === 'luxury') {
        highlights.push(
          'Premium accommodations',
          'Fine dining experiences',
          'Private guided tours',
          'Exclusive activities'
        );
      }
    }
    
    // Create the structured data object
    return {
      title,
      subtitle,
      destination: tripData.destination,
      days,
      totalCost: cost,
      type,
      highlights,
      // Store the full text response for detailed view
      fullItinerary: text
    };
  };

  const handleGenerateItinerary = async () => {
    // Validation
    if (!tripData.destination) {
      toast({
        title: 'Destination required',
        description: 'Please enter a destination for your trip.',
        variant: 'destructive'
      })
      return
    }

    if (!tripData.startDate || !tripData.endDate) {
      toast({
        title: 'Dates required',
        description: 'Please select both start and end dates for your trip.',
        variant: 'destructive'
      })
      return
    }

    setIsGenerating(true)

    try {
      // First API call - Standard itinerary
      const prompt = `Generate a travel itinerary based on the following details: 
      Source: ${tripData.source}, 
      Destination: ${tripData.destination}, 
      Start Date: ${tripData.startDate}, 
      End Date: ${tripData.endDate}, 
      Budget: ${tripData.budget}, 
      Number of Travelers: ${tripData.travelers}, 
      Age Group: ${tripData.ageGroup}, 
      Preferences: ${Object.keys(tripData.preferences)
        .filter(key => tripData.preferences[key])
        .join(', ')}.`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate standard itinerary')
      }

      const itinerary = await response.json()
      const standardItinerary = itinerary.candidates[0].content.parts[0].text
      setFirstResponse(standardItinerary)
      
      // Create and store structured data
      const standardStructured = createStructuredData(standardItinerary, 'standard')
      localStorage.setItem('standardItinerary', JSON.stringify(standardStructured))
      // Still store raw text for potential future use
      localStorage.setItem('standardItineraryRaw', standardItinerary)

      // Second API call - Budget-friendly itinerary
      const budgetPrompt = `${standardItinerary} Make it more on the budget-friendly side of travel planning. Do not hallucinate. Give the answer in the same format you got the above prompt. Do not change the structure and format of the answer.`

      const budgetResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: budgetPrompt
                  }
                ]
              }
            ]
          })
        }
      )

      if (!budgetResponse.ok) {
        throw new Error('Failed to generate budget itinerary')
      }

      const budgetItinerary = await budgetResponse.json()
      const budgetItineraryText = budgetItinerary.candidates[0].content.parts[0].text
      setSecondResponse(budgetItineraryText)
      
      // Create and store structured data
      const budgetStructured = createStructuredData(budgetItineraryText, 'budget')
      localStorage.setItem('budgetItinerary', JSON.stringify(budgetStructured))
      // Still store raw text
      localStorage.setItem('budgetItineraryRaw', budgetItineraryText)

      // Third API call - Luxury itinerary
      const luxuryPrompt = `${standardItinerary} Make it more on the Luxury side of travel planning. Do not hallucinate. Give the answer in the same format you got the above prompt. Do not change the structure and format of the answer.`

      const luxuryResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: luxuryPrompt
                  }
                ]
              }
            ]
          })
        }
      )

      if (!luxuryResponse.ok) {
        throw new Error('Failed to generate luxury itinerary')
      }

      const luxuryItinerary = await luxuryResponse.json()
      const luxuryItineraryText = luxuryItinerary.candidates[0].content.parts[0].text
      setThirdResponse(luxuryItineraryText)
      
      // Create and store structured data
      const luxuryStructured = createStructuredData(luxuryItineraryText, 'luxury')
      localStorage.setItem('luxuryItinerary', JSON.stringify(luxuryStructured))
      // Still store raw text
      localStorage.setItem('luxuryItineraryRaw', luxuryItineraryText)

      // Navigate to itinerary options page
      router.push('/itinerary-options')
    } catch (error) {
      console.error('Error generating itinerary:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate itineraries. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container px-4 md:px-6">
        <PageHeader title="Create Your Trip" backLink="/" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="elegant-card bg-white p-8 mb-8"
        >
          <TripForm tripData={tripData} onTripDataChange={handleTripDataChange} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-end"
        >
          <Button
            size="lg"
            className="elegant-button bg-blue-600 hover:bg-blue-700 px-8"
            onClick={handleGenerateItinerary}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Itineraries...
              </>
            ) : (
              <>
                Generate Itineraries
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
