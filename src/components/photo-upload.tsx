"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  photoType: "before" | "after"
  onUpload: (dataUrl: string) => void
}

async function resizeImage(file: File, maxWidth = 1920, quality = 0.8): Promise<string> {
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
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.src = URL.createObjectURL(file)
  })
}

export function PhotoUpload({ photoType, onUpload }: Props) {
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProcessing(true)
    try {
      const dataUrl = await resizeImage(file)
      onUpload(dataUrl)
    } catch {
      alert("画像の処理に失敗しました")
    } finally {
      setProcessing(false)
      if (inputRef.current) inputRef.current.value = ""
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
          onChange={handleChange}
          disabled={processing}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
        >
          {processing
            ? "処理中..."
            : `${photoType === "before" ? "Before" : "After"}写真を追加`}
        </Button>
      </Label>
    </div>
  )
}
