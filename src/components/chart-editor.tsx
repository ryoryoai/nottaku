"use client"

import { useState, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StudentChart } from "@/types/database"

type ChartField = {
  key: keyof Pick<
    StudentChart,
    "handwriting_traits" | "coaching_policy" | "strengths" | "areas_to_improve" | "goals"
  >
  label: string
  placeholder: string
}

const chartFields: ChartField[] = [
  {
    key: "handwriting_traits",
    label: "文字の特徴",
    placeholder: "例: 右上がり傾向、はね弱い、字間が狭い",
  },
  {
    key: "coaching_policy",
    label: "指導方針",
    placeholder: "例: 基本筆順の定着を優先、ゆっくり丁寧に",
  },
  {
    key: "strengths",
    label: "強み",
    placeholder: "例: バランス感覚が良い、練習熱心",
  },
  {
    key: "areas_to_improve",
    label: "改善点",
    placeholder: "例: はらいの方向、文字の大きさの統一",
  },
  {
    key: "goals",
    label: "目標",
    placeholder: "例: 年賀状を美文字で書く、ボールペン字検定3級",
  },
]

type Props = {
  chart: StudentChart
}

export function ChartEditor({ chart }: Props) {
  const supabase = createClient()
  const [values, setValues] = useState<Record<string, string | null>>(() => {
    const initial: Record<string, string | null> = {}
    for (const field of chartFields) {
      initial[field.key] = chart[field.key]
    }
    return initial
  })
  const [editingField, setEditingField] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const handleSave = useCallback(
    async (key: string, value: string) => {
      setSaving(key)
      const trimmed = value.trim() || null
      await supabase
        .from("student_charts")
        .update({ [key]: trimmed })
        .eq("id", chart.id)
      setValues((prev) => ({ ...prev, [key]: trimmed }))
      setSaving(null)
      setEditingField(null)
    },
    [supabase, chart.id]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>カルテ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {chartFields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              {field.label}
            </label>
            {editingField === field.key ? (
              <textarea
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                defaultValue={values[field.key] ?? ""}
                placeholder={field.placeholder}
                autoFocus
                onBlur={(e) => handleSave(field.key, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingField(null)
                  }
                }}
              />
            ) : (
              <button
                type="button"
                className="w-full min-h-[2.5rem] rounded-md border border-dashed px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                onClick={() => setEditingField(field.key)}
              >
                {saving === field.key ? (
                  <span className="text-muted-foreground">保存中...</span>
                ) : values[field.key] ? (
                  <span className="whitespace-pre-wrap">{values[field.key]}</span>
                ) : (
                  <span className="text-muted-foreground">
                    クリックして入力...
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
