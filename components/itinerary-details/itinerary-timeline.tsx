import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar } from "lucide-react"

interface Activity {
  time: string
  title: string
  description: string
  cost: number | null
}

interface Day {
  id: string
  number: number
  title: string
  subtitle: string
  activities: Activity[]
}

interface ItineraryTimelineProps {
  days: Day[]
  dates: string
}

export default function ItineraryTimeline({ days, dates }: ItineraryTimelineProps) {
  return (
    <Card>
      <CardHeader className="bg-blue-50 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle>Your {days.length}-Day Itinerary</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {dates}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {days.map((day) => (
            <AccordionItem key={day.id} value={day.id}>
              <AccordionTrigger className="px-6 py-4 hover:bg-blue-50 hover:no-underline">
                <div className="flex items-center">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    {day.number}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">
                      Day {day.number}: {day.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{day.subtitle}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-4">
                  {day.activities.map((activity, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-[80px_1fr_auto] gap-4 items-start ${
                        index < day.activities.length - 1 ? "border-b pb-4" : ""
                      }`}
                    >
                      <div className="text-sm text-muted-foreground">{activity.time}</div>
                      <div>
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                      </div>
                      <div className="text-sm font-medium">{activity.cost ? `€${activity.cost}` : "-"}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

