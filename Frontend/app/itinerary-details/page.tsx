'use client'

import { useEffect, useState, useRef } from 'react'
import { MessageSquare, Users } from 'lucide-react'
import PageHeader from '@/components/layout/page-header'
import ItineraryTimeline from '@/components/itinerary-details/itinerary-timeline'
import ChatInterface from '@/components/itinerary-details/chat-interface'
import TripMap from '@/components/itinerary-details/trip-map'
import TripSummary from '@/components/itinerary-details/trip-summary'
import CollaborationPanel from '@/components/itinerary-details/collaboration-panel'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import toPDF from 'react-to-pdf'

// Sample itinerary data as fallback
const defaultItineraryData = {
  title: 'Paris & French Riviera',
  dates: 'May 15 - May 21, 2025',
  totalCost: 1950,
  days: [
    {
      id: 'day1',
      number: 1,
      title: 'Paris Arrival',
      subtitle: 'Check-in, Eiffel Tower',
      activities: [
        {
          time: '9:00 AM',
          title: 'Arrival at Charles de Gaulle Airport',
          description: 'Terminal 2E',
          cost: null
        },
        {
          time: '10:30 AM',
          title: 'Transfer to Hotel',
          description: 'Private shuttle service',
          cost: 40
        },
        {
          time: '1:00 PM',
          title: 'Hotel Check-in',
          description: 'Hotel de Paris, 4-star accommodation',
          cost: 180
        },
        {
          time: '3:00 PM',
          title: 'Eiffel Tower Visit',
          description: 'Skip-the-line tickets, summit access',
          cost: 30
        },
        {
          time: '7:00 PM',
          title: 'Dinner at Bistro Parisien',
          description: 'Seine River view, French cuisine',
          cost: 60
        }
      ]
    }
    // ... other default days
  ],
  costBreakdown: {
    transportation: 585,
    accommodation: 780,
    activities: 390,
    food: 195
  },
  rawItinerary: ''
}

export default function ItineraryDetails () {
  const [itineraryData, setItineraryData] = useState(defaultItineraryData)
  const [rawMarkdown, setRawMarkdown] = useState('')
  const pdfRef = useRef(null)

  const generatePDF = () => {
    // Options for the PDF generation
    const options = {
      filename: `${itineraryData.title.replace(/\s+/g, '-')}_itinerary.pdf`,
      page: {
        margin: 20,
        format: 'letter'
      }
    }

    if (pdfRef.current) {
      toPDF(pdfRef, options)
    }
  }

  useEffect(() => {
    // Get the selected itinerary from localStorage
    const selectedItineraryString = localStorage.getItem('selectedItinerary')

    if (!selectedItineraryString) {
      console.warn('No selected itinerary found in localStorage')
      return
    }

    try {
      const selectedItinerary = JSON.parse(selectedItineraryString)

      // Get the full itinerary text from localStorage if available
      const itineraryType = selectedItinerary.type
      const fullItineraryText =
        sessionStorage.getItem(`${itineraryType}ItineraryFull`) ||
        localStorage.getItem(`${itineraryType}ItineraryRaw`) ||
        selectedItinerary.fullItinerary ||
        ''

      // Store raw markdown for display in a dedicated section
      setRawMarkdown(fullItineraryText)

      // Parse the dates from the selected itinerary
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + (selectedItinerary.days || 7))

      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }

      const dates = `${formatDate(startDate)} - ${formatDate(endDate)}`

      // Parse the fullItinerary text to extract days and activities
      const days = extractDaysFromItinerary(
        fullItineraryText,
        selectedItinerary.days || 7
      )

      // Create cost breakdown based on the total cost
      const totalCost = selectedItinerary.cost || 2000
      const costBreakdown = {
        transportation: Math.round(totalCost * 0.3),
        accommodation: Math.round(totalCost * 0.4),
        activities: Math.round(totalCost * 0.2),
        food: Math.round(totalCost * 0.1)
      }

      // Update itinerary data
      setItineraryData({
        title: selectedItinerary.title || 'Your Travel Itinerary',
        dates: dates,
        totalCost: totalCost,
        days: days,
        costBreakdown: costBreakdown,
        rawItinerary: fullItineraryText
      })
    } catch (error) {
      console.error('Error parsing selected itinerary:', error)
    }
  }, [])

  // Helper function to extract days and activities from the itinerary text
  const extractDaysFromItinerary = (text: string, numDays: number) => {
    const days = []

    // Split the text by days or similar patterns
    const dayLines = text.split(/Day \d+:|Day \d+/i)

    // Start from index 1 to skip the intro text before Day 1
    for (let i = 1; i <= numDays && i < dayLines.length; i++) {
      const dayContent = dayLines[i].trim()
      if (!dayContent) continue

      // Extract a title from the first line
      const lines = dayContent.split('\n')
      let title = lines[0].trim()
      let subtitle = ''

      // Try to extract a subtitle from location mentions or the second line
      if (lines.length > 1) {
        subtitle = lines[1]
          .trim()
          .replace(/^\s*-\s*/, '') // Remove leading dash if present
          .replace(/^\s*•\s*/, '') // Remove leading bullet if present
      }

      // Extract activities
      const activities = []
      let timeRegex = /\b([0-9]{1,2}:[0-9]{2}(?:\s*[AP]M)?)\b/i

      for (let j = 0; j < lines.length; j++) {
        const line = lines[j].trim()
        if (line.length < 5) continue

        const timeMatch = line.match(timeRegex)
        if (timeMatch) {
          const time = timeMatch[1]
          const activityText = line
            .replace(timeMatch[0], '')
            .trim()
            .replace(/^\s*-\s*/, '') // Remove leading dash
            .replace(/^\s*•\s*/, '') // Remove leading bullet

          const colonIndex = activityText.indexOf(':')
          let title = activityText
          let description = ''

          if (colonIndex > 0) {
            title = activityText.substring(0, colonIndex).trim()
            description = activityText.substring(colonIndex + 1).trim()
          }

          activities.push({
            time,
            title,
            description,
            cost: null // Cost information is typically not available in the text
          })
        }
        // Try to extract activities from bullet points if no time is found
        else if (
          (line.startsWith('-') ||
            line.startsWith('•') ||
            line.match(/^\d+\./)) &&
          line.length > 5
        ) {
          const activityText = line.replace(/^[-•\d\.]\s*/, '').trim()

          const colonIndex = activityText.indexOf(':')
          let title = activityText
          let description = ''

          if (colonIndex > 0) {
            title = activityText.substring(0, colonIndex).trim()
            description = activityText.substring(colonIndex + 1).trim()
          }

          activities.push({
            time: '',
            title,
            description,
            cost: null
          })
        }
      }

      days.push({
        id: `day${i}`,
        number: i,
        title: title || `Day ${i}`,
        subtitle: subtitle || `Activities for Day ${i}`,
        activities:
          activities.length > 0
            ? activities
            : [
                {
                  time: 'All Day',
                  title: 'Explore',
                  description: 'Details not available',
                  cost: null
                }
              ],
        // Store the raw content for this day for markdown rendering
        rawContent: dayContent
      })
    }

    // If we couldn't extract any days, create a default structure
    if (days.length === 0) {
      for (let i = 1; i <= numDays; i++) {
        days.push({
          id: `day${i}`,
          number: i,
          title: `Day ${i}`,
          subtitle: 'Details not available',
          activities: [
            {
              time: 'All Day',
              title: 'Itinerary activities',
              description: 'Details not available',
              cost: null
            }
          ],
          rawContent: ''
        })
      }
    }

    return days
  }

  return (
    <div className='py-12 bg-gray-50'>
      <div className='container px-4 md:px-6'>
        <PageHeader title={itineraryData.title} backLink='/itinerary-options' />

        <div className='grid gap-8 lg:grid-cols-[1fr_350px]'>
          {/* Left side - Itinerary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='space-y-8'
          >
            {/* <ItineraryTimeline days={itineraryData.days} dates={itineraryData.dates} /> */}

            {/* Add a section that displays the raw itinerary with proper markdown formatting */}
            <div className='elegant-card bg-white p-8 relative'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-semibold'>Complete Itinerary</h2>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={generatePDF}
                  className='flex items-center gap-2'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                    <polyline points='7 10 12 15 17 10' />
                    <line x1='12' y1='15' x2='12' y2='3' />
                  </svg>
                  Download PDF
                </Button>
              </div>
              <div
                className='prose max-w-none overflow-y-auto max-h-[500px] pr-4'
                ref={pdfRef}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f8fafc'
                }}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {rawMarkdown}
                </ReactMarkdown>
              </div>
            </div>

            <TripMap />
          </motion.div>

          {/* Right side - Chat & Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='space-y-8'
          >
            <Tabs defaultValue='chat' className='elegant-card bg-white'>
              <TabsList className='grid w-full grid-cols-2 p-1'>
                <TabsTrigger value='chat' className='rounded-xl'>
                  <MessageSquare className='h-4 w-4 mr-2' />
                  Trip Assistant
                </TabsTrigger>
                <TabsTrigger value='collaborate' className='rounded-xl'>
                  <Users className='h-4 w-4 mr-2' />
                  Collaborate
                </TabsTrigger>
              </TabsList>
              <TabsContent value='chat' className='p-4'>
                <ChatInterface />
              </TabsContent>
              <TabsContent value='collaborate' className='p-4'>
                <CollaborationPanel />
              </TabsContent>
            </Tabs>

            <TripSummary
              totalCost={itineraryData.totalCost}
              duration={itineraryData.days.length}
              costBreakdown={itineraryData.costBreakdown}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
