"use client"

import { useState } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LessonPhoto } from "@/types/database"

type Props = {
  photos: LessonPhoto[]
  supabaseUrl: string
}

export function PhotoGallery({ photos, supabaseUrl }: Props) {
  const supabase = createClient()
  const [comments, setComments] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const photo of photos) {
      initial[photo.id] = photo.comment ?? ""
    }
    return initial
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const beforePhotos = photos.filter((p) => p.photo_type === "before")
  const afterPhotos = photos.filter((p) => p.photo_type === "after")

  const getPublicUrl = (path: string) => {
    // モックモード: /mock-photos/ で始まるパスはそのまま使う
    if (path.startsWith("/")) return path
    return `${supabaseUrl}/storage/v1/object/public/lesson-photos/${path}`
  }

  const handleSaveComment = async (photoId: string, comment: string) => {
    const trimmed = comment.trim() || null
    await supabase
      .from("lesson_photos")
      .update({ comment: trimmed })
      .eq("id", photoId)
    setComments((prev) => ({ ...prev, [photoId]: trimmed ?? "" }))
    setEditingId(null)
  }

  const renderPhotoGroup = (title: string, groupPhotos: LessonPhoto[]) => (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      {groupPhotos.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {groupPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={getPublicUrl(photo.storage_path)}
                  alt={photo.caption ?? `${title}写真`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <CardContent className="p-3">
                {photo.caption && (
                  <p className="mb-1 text-sm font-medium">{photo.caption}</p>
                )}
                {editingId === photo.id ? (
                  <textarea
                    className="w-full rounded border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    rows={2}
                    defaultValue={comments[photo.id]}
                    autoFocus
                    placeholder="コメントを入力..."
                    onBlur={(e) => handleSaveComment(photo.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEditingId(null)
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="w-full text-left text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setEditingId(photo.id)}
                  >
                    {comments[photo.id] || "クリックしてコメント..."}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-sm text-muted-foreground">
          写真はまだありません
        </p>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {renderPhotoGroup("Before", beforePhotos)}
        {renderPhotoGroup("After", afterPhotos)}
      </div>
    </div>
  )
}
