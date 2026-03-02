import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ChartEditor } from "@/components/chart-editor"
import { StudentEditForm } from "./student-edit-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getMockStudent,
  getMockChart,
  getMockLessonsForStudent,
} from "@/lib/mock-data"
import type { StudentChart } from "@/types/database"

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const student = getMockStudent(id)
  if (!student) notFound()

  const chart: StudentChart = getMockChart(id) ?? {
    id: `c-${id}`,
    student_id: id,
    handwriting_traits: null,
    coaching_policy: null,
    strengths: null,
    areas_to_improve: null,
    goals: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const lessons = getMockLessonsForStudent(id)

  const statusLabels: Record<string, string> = {
    active: "受講中",
    inactive: "休会中",
    graduated: "卒業",
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <Badge>{statusLabels[student.status]}</Badge>
          </div>
          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/students/${id}/lessons/new`}>レッスン記録</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/students/${id}/progress`}>進捗</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <StudentEditForm student={student} />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>レッスン履歴</CardTitle>
                <Button size="sm" asChild>
                  <Link href={`/students/${id}/lessons/new`}>新規記録</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {lessons.length > 0 ? (
                  <div className="space-y-2">
                    {lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        href={`/students/${id}/lessons/${lesson.id}`}
                        className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {lesson.topic || "テーマ未設定"}
                          </p>
                          {lesson.coach_note && (
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {lesson.coach_note}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-sm text-muted-foreground">
                            {lesson.lesson_date}
                          </span>
                          {lesson.lesson_number && (
                            <Badge variant="secondary" className="text-xs">
                              #{lesson.lesson_number}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    レッスン記録はまだありません
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <ChartEditor chart={chart} />
          </div>
        </div>
      </main>
    </div>
  )
}
