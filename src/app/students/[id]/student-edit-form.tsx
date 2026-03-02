"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateStudent, deleteStudent } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Student } from "@/types/database"

export function StudentEditForm({ student }: { student: Student }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await updateStudent(student.id, formData)
    setLoading(false)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!confirm(`${student.name}さんを削除しますか？この操作は取り消せません。`)) return
    await deleteStudent(student.id)
  }

  if (!editing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>基本情報</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            編集
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow label="ふりがな" value={student.name_kana} />
          <InfoRow label="メール" value={student.email} />
          <InfoRow label="電話" value={student.phone} />
          <InfoRow label="レッスン曜日" value={student.lesson_day} />
          <InfoRow label="受講開始日" value={student.start_date} />
          <InfoRow label="メモ" value={student.memo} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>基本情報を編集</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">名前 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={student.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_kana">ふりがな</Label>
              <Input
                id="name_kana"
                name="name_kana"
                defaultValue={student.name_kana ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">メール</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={student.email ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={student.phone ?? ""}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lesson_day">レッスン曜日</Label>
              <Select
                name="lesson_day"
                defaultValue={student.lesson_day ?? ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択" />
                </SelectTrigger>
                <SelectContent>
                  {["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"].map(
                    (day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">受講開始日</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                defaultValue={student.start_date ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">ステータス</Label>
            <Select name="status" defaultValue={student.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">受講中</SelectItem>
                <SelectItem value="inactive">休会中</SelectItem>
                <SelectItem value="graduated">卒業</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">メモ</Label>
            <Textarea
              id="memo"
              name="memo"
              rows={3}
              defaultValue={student.memo ?? ""}
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

function InfoRow({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="w-28 shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value || "-"}</span>
    </div>
  )
}
