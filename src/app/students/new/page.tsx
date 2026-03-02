"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { Header } from "@/components/layout/header"
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

export default function NewStudentPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      name_kana: (formData.get("name_kana") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      lesson_day: (formData.get("lesson_day") as string) || null,
      start_date: (formData.get("start_date") as string) || null,
      status: (formData.get("status") as string) || "active",
      memo: (formData.get("memo") as string) || null,
    }

    const { data: student, error } = await supabase
      .from("students")
      .insert(data)
      .select()
      .single()

    if (error) {
      alert("登録に失敗しました: " + error.message)
      setLoading(false)
      return
    }

    // カルテも同時作成
    await supabase.from("student_charts").insert({
      student_id: student.id,
    })

    router.push(`/students/${student.id}`)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">生徒登録</h1>
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">名前 *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_kana">ふりがな</Label>
                  <Input id="name_kana" name="name_kana" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input id="email" name="email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="lesson_day">通常レッスン曜日</Label>
                  <Select name="lesson_day">
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
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
                  <Input id="start_date" name="start_date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス</Label>
                <Select name="status" defaultValue="active">
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
                <Textarea id="memo" name="memo" rows={3} />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? "登録中..." : "登録する"}
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
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
