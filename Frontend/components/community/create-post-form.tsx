"use client"

import type React from "react"

import { useState } from "react"
import { ImagePlus, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function CreatePostForm({ locationId }: { locationId: number }) {
  const [content, setContent] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // In a real app, you would upload the file to a storage service
    // For this demo, we'll just create a local preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim() && !imagePreview) {
      toast({
        title: "Cannot submit empty post",
        description: "Please add some text or an image to your post.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, you would submit to your API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Post created!",
      description: "Your post has been shared with the community.",
    })

    // Reset form
    setContent("")
    setImagePreview(null)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Share your travel experience..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px] resize-none"
      />

      {imagePreview && (
        <div className="relative aspect-video w-full rounded-md overflow-hidden">
          <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setImagePreview(null)}
          >
            Remove
          </Button>
        </div>
      )}

      <div className="flex justify-between">
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("image-upload")?.click()}
            disabled={isUploading}
          >
            <ImagePlus className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Add Photo"}
          </Button>
          <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  )
}

