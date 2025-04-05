"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export default function ChatInterface() {
  const [message, setMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([
    {
      role: "system",
      content: "Welcome to your trip to Paris & the French Riviera! How can I help you with your itinerary?",
    },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setChatMessages([...chatMessages, { role: "user", content: message }])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "I can help with that! I've updated your itinerary with your request. Is there anything else you'd like to modify?",
        },
      ])
    }, 1000)
  }

  return (
    <Card className="border-blue-200">
      <CardContent className="p-4">
        <div className="h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Ask about your trip..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border-blue-200"
            />
            <Button type="submit" size="icon" className="bg-blue-600">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

