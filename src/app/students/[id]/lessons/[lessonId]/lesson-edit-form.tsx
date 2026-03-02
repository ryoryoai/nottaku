"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Lesson } from "@/types/database"

export function LessonEditForm({
  lesson,
  studentId,
}: {
  lesson: Lesson
  studentId: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)

    const { error } = await supabase
      .from("lessons")
      .update({
        lesson_date: formData.get("lesson_date") as string,
        lesson_number: formData.get("lesson_number")
          ? Number(formData.get("lesson_number"))
          : null,
        topic: (formData.get("topic") as string) || null,
        coach_note: (formData.get("coach_note") as string) || null,
        homework: (formData.get("homework") as string) || null,
      })
      .eq("id", lesson.id)

    if (error) {
      alert("更新に失敗しました: " + error.message)
    } else {
      router.refresh()
      setEditing(false)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("このレッスン記録を削除しますか？写真も削除されます。")) return
    await supabase.from("lessons").delete().eq("id", lesson.id)
    router.push(`/students/${studentId}`)
  }

  if (!editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>レッスン情報</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            編集
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="練習テーマ" value={lesson.topic} />
          <InfoRow label="コーチの所感" value={lesson.coach_note} />
          <InfoRow label="宿題" value={lesson.homework} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>レッスン情報を編集</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lesson_date">レッスン日</Label>
              <Input
                id="lesson_date"
                name="lesson_date"
                type="date"
                defaultValue={lesson.lesson_date}
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
                defaultValue={lesson.lesson_number ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">練習テーマ</Label>
            <Input
              id="topic"
              name="topic"
              defaultValue={lesson.topic ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coach_note">コーチの所感</Label>
            <Textarea
              id="coach_note"
              name="coach_note"
              rows={3}
              defaultValue={lesson.coach_note ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="homework">宿題</Label>
            <Textarea
              id="homework"
              name="homework"
              rows={2}
              defaultValue={lesson.homework ?? ""}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "保存中..." : "保存"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(false)}
              >
                キャンセル
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              削除
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap text-sm">{value || "-"}</p>
    </div>
  )
}
