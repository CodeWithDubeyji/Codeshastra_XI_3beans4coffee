export function MapSkeleton() {
    return (
      <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="text-slate-400">Loading map...</div>
      </div>
    )
  }
  
  export function PostSkeleton() {
    return (
      <div className="border border-slate-200 rounded-lg p-4 mb-4 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 mr-3"></div>
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-48 bg-slate-200 rounded w-full"></div>
      </div>
    )
  }
  
  