import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TripMap() {
  return (
    <Card>
      <CardHeader className="bg-blue-50">
        <CardTitle>Trip Map</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative w-full h-[400px] rounded-md overflow-hidden border">
          <Image src="/placeholder.svg?height=400&width=800" alt="Trip Map" fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground bg-white/80 px-3 py-1 rounded">
              Interactive map will be displayed here
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

