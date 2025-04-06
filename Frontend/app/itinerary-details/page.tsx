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

export default function ItineraryDetails() {
  const [itineraryData, setItineraryData] = useState(defaultItineraryData)
  const [rawMarkdown, setRawMarkdown] = useState('')
  const pdfRef = useRef(null)
  const fullContentRef = useRef(null)

  // Update the generatePDF function and hidden div

  const generatePDF = () => {
    // Create a temporary div element that will be visible during PDF generation
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px' // Position off-screen
    tempDiv.style.top = '0'
    tempDiv.innerHTML = `
    <div class="p-8 bg-white" style="width: 800px;">
      <h1 class="text-2xl font-bold mb-4">${itineraryData.title}</h1>
      <p class="text-gray-600 mb-6">${itineraryData.dates}</p>
      <div class="prose max-w-none">
        ${document.querySelector('.prose')?.innerHTML || ''}
      </div>
    </div>
  `

    // Append to body
    document.body.appendChild(tempDiv)

    // Options for the PDF generation
    const options = {
      filename: `${itineraryData.title.replace(/\s+/g, '-')}_itinerary.pdf`,
      page: {
        margin: 20,
        format: 'letter'
      }
    }

    // Generate PDF from the temporary div - wrap the element in a function to match TargetElementFinder type
    toPDF(() => tempDiv, options)
      .then(() => {
        // Remove the temporary div after PDF generation
        document.body.removeChild(tempDiv)
      })
      .catch(error => {
        console.error('Error generating PDF:', error)
        document.body.removeChild(tempDiv)
      })
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
            <div className='elegant-card bg-white p-0 rounded-2xl shadow-md overflow-hidden border border-gray-100'>
              <div className='flex justify-between items-center p-6 border-b border-gray-100'>
                <h2 className='text-2xl font-semibold text-gray-800 flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Complete Itinerary
                </h2>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={generatePDF}
                  className='flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full py-2 px-4 transition-all'
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
                className='p-6'
                ref={pdfRef}
              >
                <div className='flex justify-between items-center mb-6'>
                  <div className='flex items-center gap-2 text-gray-500'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{itineraryData.dates}</span>
                  </div>
                  <div className='flex items-center gap-2 text-gray-500'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg> */}
                    <span>Total: ₹{itineraryData.totalCost}</span>
                  </div>
                </div>

                <div
                  className='prose max-w-none overflow-y-auto max-h-[600px] pr-4 itinerary-content'
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 #f8fafc'
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => <h1 {...props} className="text-2xl font-bold text-gray-800 mt-8 mb-4" />,
                      h2: ({ node, ...props }) => <h2 {...props} className="text-xl font-semibold text-gray-700 mt-6 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"></path>
                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                        </svg>
                        {props.children}
                      </h2>,
                      h3: ({ node, ...props }) => <h3 {...props} className="text-lg font-medium text-gray-700 mt-4 mb-2" />,
                      p: ({ node, ...props }) => <p {...props} className="text-gray-600 mb-4 leading-relaxed" />,
                      ul: ({ node, ...props }) => <ul {...props} className="pl-6 mb-4 space-y-2" />,
                      ol: ({ node, ...props }) => <ol {...props} className="pl-6 mb-4 space-y-2" />,
                      li: ({ node, ...props }) => <li {...props} className="text-gray-600 flex items-start gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0 text-blue-500">
                          <polyline points="9 11 12 14 22 4"></polyline>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>
                        <span>{props.children}</span>
                      </li>,
                      blockquote: ({ node, ...props }) => <blockquote {...props} className="border-l-4 border-gray-200 pl-4 italic text-gray-600" />,
                      code: ({ node, ...props }) => <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-gray-800" />,
                      pre: ({ node, ...props }) => <pre {...props} className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 border border-gray-200" />,
                      a: ({ node, ...props }) => <a {...props} className="text-blue-500 hover:text-blue-700 underline" />,
                      img: ({ node, ...props }) => <img {...props} className="rounded-lg max-w-full h-auto my-4 shadow-sm" />,
                      table: ({ node, ...props }) => <div className="overflow-x-auto my-6">
                        <table {...props} className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg" />
                      </div>,
                      thead: ({ node, ...props }) => <thead {...props} className="bg-gray-50" />,
                      tbody: ({ node, ...props }) => <tbody {...props} className="divide-y divide-gray-200" />,
                      tr: ({ node, ...props }) => <tr {...props} className="hover:bg-gray-50" />,
                      th: ({ node, ...props }) => <th {...props} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />,
                      td: ({ node, ...props }) => <td {...props} className="px-4 py-3 whitespace-nowrap text-sm text-gray-600" />,
                      hr: ({ node, ...props }) => <hr {...props} className="my-6 border-t border-gray-200" />,
                    }}
                  >
                    {rawMarkdown}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex gap-4 border-t border-gray-100 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{itineraryData.days.length} Days</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>Activities: {itineraryData.days.reduce((acc, day) => acc + day.activities.length, 0)}</span>
                </div>
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

