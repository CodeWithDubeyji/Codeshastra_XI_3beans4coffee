import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export default function CollaborationPanel() {
  return (
    <Card className="border-blue-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <Users className="h-8 w-8 mx-auto text-blue-600" />
            <h3 className="font-medium">Invite Collaborators</h3>
            <p className="text-sm text-muted-foreground">Share this trip with friends and family to plan together</p>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Enter email address" className="flex-1 border-blue-200" />
            <Button className="bg-blue-600">Invite</Button>
          </div>
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Current Collaborators</h4>
            <p className="text-sm text-muted-foreground">No collaborators yet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

