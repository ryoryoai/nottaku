"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Header } from "@/components/layout/header"
import { PhotoUpload } from "@/components/photo-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

type PendingPhoto = {
  storage_path: string
  url: string
  photo_type: "before" | "after"
  caption: string
}

export default function NewLessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: studentId } = use(params)
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [lessonId] = useState(() => crypto.randomUUID())
  const [photos, setPhotos] = useState<PendingPhoto[]>([])

  const handlePhotoUpload = (
    photo: { storage_path: string; url: string },
    type: "before" | "after"
  ) => {
    setPhotos((prev) => [
      ...prev,
      { ...photo, photo_type: type, caption: "" },
    ])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const { error: lessonError } = await supabase.from("lessons").insert({
      id: lessonId,
      student_id: studentId,
      lesson_date: formData.get("lesson_date") as string,
      lesson_number: formData.get("lesson_number")
        ? Number(formData.get("lesson_number"))
        : null,
      topic: (formData.get("topic") as string) || null,
      coach_note: (formData.get("coach_note") as string) || null,
      homework: (formData.get("homework") as string) || null,
    })

    if (lessonError) {
      alert("レッスン登録に失敗しました: " + lessonError.message)
      setLoading(false)
      return
    }

    if (photos.length > 0) {
      const photoRecords = photos.map((p, i) => ({
        lesson_id: lessonId,
        photo_type: p.photo_type,
        storage_path: p.storage_path,
        display_order: i,
        caption: p.caption || null,
      }))

      await supabase.from("lesson_photos").insert(photoRecords)
    }

    router.push(`/students/${studentId}/lessons/${lessonId}`)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">レッスン記録</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>レッスン情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lesson_date">レッスン日 *</Label>
                  <Input
                    id="lesson_date"
                    name="lesson_date"
                    type="date"
                    defaultValue={today}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lesson_number">第何回</Label>
                  <Input
                    id="lesson_number"
                    name="lesson_number"
                    type="number"
                    min={1}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic">練習テーマ</Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder='例: ひらがな「あ」「い」「う」'
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coach_note">コーチの所感</Label>
                <Textarea
                  id="coach_note"
                  name="coach_note"
                  rows={3}
                  placeholder="レッスン中の様子、気づいたこと..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homework">宿題・次回までの課題</Label>
                <Textarea
                  id="homework"
                  name="homework"
                  rows={2}
                  placeholder="次回までにやること..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>写真</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">Before</p>
                  <PhotoUpload
                    studentId={studentId}
                    lessonId={lessonId}
                    photoType="before"
                    onUpload={(p) => handlePhotoUpload(p, "before")}
                  />
                  <div className="mt-2 space-y-2">
                    {photos
                      .filter((p) => p.photo_type === "before")
                      .map((p, i) => (
                        <div
                          key={p.storage_path}
                          className="relative aspect-[4/3] overflow-hidden rounded-md border"
                        >
                          <Image
                            src={p.url}
                            alt={`Before ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">After</p>
                  <PhotoUpload
                    studentId={studentId}
                    lessonId={lessonId}
                    photoType="after"
                    onUpload={(p) => handlePhotoUpload(p, "after")}
                  />
                  <div className="mt-2 space-y-2">
                    {photos
                      .filter((p) => p.photo_type === "after")
                      .map((p, i) => (
                        <div
                          key={p.storage_path}
                          className="relative aspect-[4/3] overflow-hidden rounded-md border"
                        >
                          <Image
                            src={p.url}
                            alt={`After ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存する"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
