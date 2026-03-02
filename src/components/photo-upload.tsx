"use client"

import { useState, useRef } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UploadedPhoto = {
  storage_path: string
  url: string
}

type Props = {
  studentId: string
  lessonId: string
  photoType: "before" | "after"
  onUpload: (photo: UploadedPhoto) => void
}

async function resizeImage(file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => resolve(blob!),
        "image/jpeg",
        quality
      )
    }
    img.src = URL.createObjectURL(file)
  })
}

export function PhotoUpload({ studentId, lessonId, photoType, onUpload }: Props) {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const resized = await resizeImage(file)
    const timestamp = Date.now()
    const path = `${studentId}/${lessonId}/${timestamp}-${photoType}.jpg`

    const { error } = await supabase.storage
      .from("lesson-photos")
      .upload(path, resized, {
        contentType: "image/jpeg",
        upsert: false,
      })

    if (error) {
      alert("アップロードに失敗しました: " + error.message)
      setUploading(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from("lesson-photos")
      .getPublicUrl(path)

    onUpload({
      storage_path: path,
      url: urlData.publicUrl,
    })
    setUploading(false)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div>
      <Label className="cursor-pointer">
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading
            ? "アップロード中..."
            : `${photoType === "before" ? "Before" : "After"}写真を追加`}
        </Button>
      </Label>
    </div>
  )
}
