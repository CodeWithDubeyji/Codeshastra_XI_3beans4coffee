import { Suspense } from "react"
import CommunityMap from "@/components/community/community-map"
import { MapSkeleton } from "@/components/community/skeletons"



export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Explore Communities</h1>
        <p className="text-slate-600 mb-8">Discover travel experiences shared by our community around the world</p>

        <div className="h-[calc(100vh-200px)] w-full rounded-xl overflow-hidden border border-slate-200 shadow-lg">
          <Suspense fallback={<MapSkeleton />}>
            <CommunityMap />
          </Suspense>
        </div>
      </div>
     
    </main>
  )
}