import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface TripSummaryProps {
  totalCost: number
  duration: number
  costBreakdown: {
    transportation: number
    accommodation: number
    activities: number
    food: number
  }
}

export default function TripSummary({ totalCost, duration, costBreakdown }: TripSummaryProps) {
  return (
    <Card>
      <CardHeader className="bg-blue-50 pb-4">
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Trip Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="font-bold text-xl text-blue-600">${totalCost}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{duration} days</div>
            </div>
          </div>
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Cost Breakdown</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Transportation</span>
                <span className="font-medium">${costBreakdown.transportation}</span>
              </div>
              <div className="flex justify-between">
                <span>Accommodation</span>
                <span className="font-medium">${costBreakdown.accommodation}</span>
              </div>
              <div className="flex justify-between">
                <span>Activities</span>
                <span className="font-medium">${costBreakdown.activities}</span>
              </div>
              <div className="flex justify-between">
                <span>Food</span>
                <span className="font-medium">${costBreakdown.food}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

