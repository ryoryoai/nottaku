"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PhotoUpload } from "@/components/photo-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type PendingPhoto = {
  dataUrl: string
  photo_type: "before" | "after"
}

export default function NewLessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: studentId } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [photos, setPhotos] = useState<PendingPhoto[]>([])

  const handlePhotoUpload = (dataUrl: string, type: "before" | "after") => {
    setPhotos((prev) => [...prev, { dataUrl, photo_type: type }])
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    // モックモード: DB保存をスキップ、写真プレビューのみ
    setSaved(true)
    setLoading(false)
  }

  const today = new Date().toISOString().split("T")[0]
  const beforePhotos = photos.filter((p) => p.photo_type === "before")
  const afterPhotos = photos.filter((p) => p.photo_type === "after")

  if (saved) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-6">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="mb-4 text-4xl">&#10003;</div>
              <h2 className="mb-2 text-xl font-bold">レッスンを記録しました</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                写真{photos.length}枚が記録されました
              </p>
              {photos.length > 0 && (
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {photos.map((p, i) => (
                    <div key={i} className="space-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md border">
                        <img
                          src={p.dataUrl}
                          alt={`${p.photo_type} ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center uppercase">
                        {p.photo_type}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-center gap-3">
                <Button onClick={() => { setSaved(false); setPhotos([]) }}>
                  続けて記録
                </Button>
                <Button variant="outline" onClick={() => router.push(`/students/${studentId}`)}>
                  生徒詳細に戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

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
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">Before</p>
                    <PhotoUpload
                      photoType="before"
                      onUpload={(url) => handlePhotoUpload(url, "before")}
                    />
                  </div>
                  <div className="space-y-2">
                    {beforePhotos.length > 0 ? (
                      beforePhotos.map((p, i) => {
                        const globalIdx = photos.indexOf(p)
                        return (
                          <div key={globalIdx} className="group relative">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-md border">
                              <img
                                src={p.dataUrl}
                                alt={`Before ${i + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(globalIdx)}
                              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-white shadow"
                            >
                              x
                            </button>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                        練習前の写真を撮影
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold">After</p>
                    <PhotoUpload
                      photoType="after"
                      onUpload={(url) => handlePhotoUpload(url, "after")}
                    />
                  </div>
                  <div className="space-y-2">
                    {afterPhotos.length > 0 ? (
                      afterPhotos.map((p, i) => {
                        const globalIdx = photos.indexOf(p)
                        return (
                          <div key={globalIdx} className="group relative">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-md border">
                              <img
                                src={p.dataUrl}
                                alt={`After ${i + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(globalIdx)}
                              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-xs text-white shadow"
                            >
                              x
                            </button>
                          </div>
                        )
                      })
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                        練習後の写真を撮影
                      </div>
                    )}
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
