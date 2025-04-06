'use client'
import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, Loader2 } from 'lucide-react'

export default function ChatInterface() {
  const [itineraryData, setItineraryData] = useState<{
    title?: string
    destinations?: string
    fullItinerary?: string
    type?: string
  }>({})
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Load itinerary data from localStorage
  useEffect(() => {
    try {
      // Move localStorage access inside useEffect to prevent SSR issues
      const selectedItineraryStr = localStorage.getItem('selectedItinerary')
      
      if (selectedItineraryStr) {
        const selectedItinerary = JSON.parse(selectedItineraryStr)
        setItineraryData(selectedItinerary)
        
        // Initialize chat with welcome message using the title
        setChatMessages([{
          role: "system",
          content: `Welcome to your ${selectedItinerary.title || "trip"}! How can I help you with your itinerary?`
        }])
      } else {
        // Fallback if no itinerary is found
        setChatMessages([{
          role: "system",
          content: "Welcome! How can I help you with your travel plans?"
        }])
      }
    } catch (error) {
      console.error("Error parsing itinerary data:", error)
      // Set a fallback message
      setChatMessages([{
        role: "system",
        content: "Welcome! How can I help you with your travel plans?"
      }])
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isProcessing) return

    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: message }])
    
    // Save user query and clear input
    const userInput = message
    setMessage('')
    setIsProcessing(true)

    try {
      // Add typing indicator
      setChatMessages(prev => [...prev, { role: 'system', content: '...' }])
      
      // Retrieve the current itinerary data from localStorage
      const currentItineraryStr = localStorage.getItem('selectedItinerary')
      if (!currentItineraryStr) {
        throw new Error('No itinerary data found')
      }
      
      const currentItinerary = JSON.parse(currentItineraryStr)
      
      // Create prompt for the API
      const prompt = `
      **ROLE**: You are a travel itinerary editor that modifies string-format itineraries.

      **CURRENT ITINERARY**:
      """
      ${currentItinerary.fullItinerary}
      """

      **USER REQUEST**: "${userInput}"

      **INSTRUCTIONS**:
      1. Make minimal changes to fulfill the request
      2. Preserve all original formatting (line breaks, markdown, etc.)
      3. Only modify explicitly requested parts
      4. Return ONLY the modified string content
      5. If request is unclear, return the original unchanged

      **OUTPUT REQUIREMENTS**:
      - No additional text or explanations
      - Only return the exact modified itinerary string
      - Maintain all original styling

      **RESPONSE**:
      `

      // Call Gemini API
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
        throw new Error('Failed to generate response')
      }

      const result = await response.json()
      const updatedItinerary = result.candidates[0].content.parts[0].text

      // Remove typing indicator
      setChatMessages(prev => prev.slice(0, -1))

      // Update itinerary data in localStorage
      const updatedItineraryData = {
        ...currentItinerary,
        fullItinerary: updatedItinerary
      }
      
      // Update localStorage with the modified itinerary
      localStorage.setItem('selectedItinerary', JSON.stringify(updatedItineraryData))
      
      // Also update the raw itinerary in localStorage and sessionStorage
      const itineraryType = currentItinerary.type
      if (itineraryType) {
        localStorage.setItem(`${itineraryType}ItineraryRaw`, updatedItinerary)
        sessionStorage.setItem(`${itineraryType}ItineraryFull`, updatedItinerary)
      }
      
      // Update local state
      setItineraryData(updatedItineraryData)
      
      // Add AI response to chat
      setChatMessages(prev => [
        ...prev, 
        { 
          role: 'system', 
          content: `I've updated your itinerary based on your request to "${userInput}". Is there anything else you'd like to modify?`
        }
      ])
      
      // Trigger an event so the parent page knows to refresh the itinerary display
      window.dispatchEvent(new CustomEvent('itinerary-updated', {
        detail: { updatedItinerary }
      }))
      
    } catch (error) {
      console.error('Error updating itinerary:', error)
      
      // Remove typing indicator
      setChatMessages(prev => prev.slice(0, -1))
      
      // Show error message
      setChatMessages(prev => [
        ...prev,
        {
          role: 'system',
          content: "I'm sorry, I couldn't process that request. Please try again."
        }
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className='border-blue-200'>
      <CardContent className='p-4'>
        <div className='h-[400px] flex flex-col'>
          <div className='flex-1 overflow-y-auto mb-4 space-y-4'>
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content === '...' ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className='flex gap-2'>
            <Input
              placeholder='Ask about your trip...'
              value={message}
              onChange={e => setMessage(e.target.value)}
              className='flex-1 border-blue-200'
            />
            <Button type='submit' size='icon' className='bg-blue-600'>
              {isProcessing ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Send className='h-4 w-4' />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
