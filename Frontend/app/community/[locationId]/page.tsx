import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Users, MapPin } from "lucide-react"
import CommunityPosts from "@/components/community/community-posts"
import CreatePostForm from "@/components/community/create-post-form"
import { PostSkeleton } from "@/components/community/skeletons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock function to get location data - in a real app, this would fetch from an API
async function getLocationData(id: string) {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const locations = {
    "1": {
      id: 1,
      name: "Paris",
      country: "France",
      image: "/placeholder.svg?height=400&width=800",
      memberCount: 3240,
      postCount: 124,
    },
    "2": {
      id: 2,
      name: "Tokyo",
      country: "Japan",
      image: "/placeholder.svg?height=400&width=800",
      memberCount: 2180,
      postCount: 89,
    },
    "3": {
      id: 3,
      name: "New York",
      country: "USA",
      image: "/placeholder.svg?height=400&width=800",
      memberCount: 4120,
      postCount: 156,
    },
    "4": {
      id: 4,
      name: "Sydney",
      country: "Australia",
      image: "/placeholder.svg?height=400&width=800",
      memberCount: 1890,
      postCount: 67,
    },
    "5": {
      id: 5,
      name: "Cape Town",
      country: "South Africa",
      image: "/placeholder.svg?height=400&width=800",
      memberCount: 980,
      postCount: 42,
    },
  }

  return locations[id as keyof typeof locations]
}

export default async function CommunityPage({ params }: { params: { locationId: string } }) {
  const location = await getLocationData(params.locationId)

  if (!location) {
    return <div>Location not found</div>
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="relative h-[300px] w-full">
        <Image src={location.image || "/placeholder.svg"} alt={location.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{location.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{location.country}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{location.memberCount.toLocaleString()} members</span>
            </div>
          </div>
        </div>
        <Link href="/" className="absolute top-4 left-4">
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Map
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="scrapbook">Scrapbook</TabsTrigger>
            <TabsTrigger value="tips">Travel Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Share your experience</h2>
              <CreatePostForm locationId={location.id} />
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-4">Community Posts</h2>
              <Suspense
                fallback={
                  <>
                    <PostSkeleton />
                    <PostSkeleton />
                  </>
                }
              >
                <CommunityPosts locationId={location.id} />
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="scrapbook">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={`/placeholder.svg?height=400&width=400&text=Scrapbook+${i + 1}`}
                    alt={`Scrapbook image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Travel Tip #{i + 1}</h3>
                  <p className="text-slate-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit
                    arcu sed erat molestie vehicula.
                  </p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

