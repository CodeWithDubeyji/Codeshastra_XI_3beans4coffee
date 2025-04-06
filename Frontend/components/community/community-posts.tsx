import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Mock function to get posts - in a real app, this would fetch from an API
async function getPosts(locationId: number) {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate some mock posts
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    user: {
      id: `user-${i + 1}`,
      name: `Traveler ${i + 1}`,
      avatar: `/placeholder.svg?height=40&width=40&text=${i + 1}`,
    },
    content:
      i % 2 === 0
        ? "Just visited this amazing place! The architecture is stunning and the local food is to die for. Would definitely recommend spending at least 3 days here to fully experience everything it has to offer."
        : "Had the most incredible experience here. The locals were so friendly and the views were breathtaking. Don't miss the sunset from the main viewpoint!",
    image: `/placeholder.svg?height=400&width=800&text=Travel+Post+${i + 1}`,
    postedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Days ago
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
  }))
}

export default async function CommunityPosts({ locationId }: { locationId: number }) {
  const posts = await getPosts(locationId)

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{post.user.name}</h3>
                <p className="text-sm text-slate-500">{formatDistanceToNow(post.postedAt, { addSuffix: true })}</p>
              </div>
            </div>
            <p className="mb-4">{post.content}</p>
          </div>

          <div className="relative aspect-video w-full">
            <Image src= "/anthony-delanoix-QAwciFlS1g4-unsplash.jpg" alt="Post image" fill className="object-cover" />
          </div>

          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-600">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-slate-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="text-slate-600">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

