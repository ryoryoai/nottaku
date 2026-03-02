import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockStudents, getMockRecentLessons } from "@/lib/mock-data"

export default function DashboardPage() {
  const students = mockStudents.filter((s) => s.status === "active")
  const recentLessons = getMockRecentLessons(5)
  const activeCount = students.length

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold">ダッシュボード</h1>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                アクティブ生徒数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                直近レッスン数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{recentLessons.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>直近のレッスン</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/students">すべて見る</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/students/${lesson.student_id}/lessons/${lesson.id}`}
                    className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium">{lesson.students?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {lesson.topic || "テーマ未設定"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{lesson.lesson_date}</p>
                      {lesson.lesson_number && (
                        <Badge variant="secondary">
                          第{lesson.lesson_number}回
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>レッスン記録</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/students">生徒一覧</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => (
                  <Link
                    key={student.id}
                    href={`/students/${student.id}/lessons/new`}
                    className="flex items-center justify-between rounded-md border p-3 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium">{student.name}</p>
                      {student.name_kana && (
                        <p className="text-xs text-muted-foreground">
                          {student.name_kana}
                        </p>
                      )}
                    </div>
                    <Button size="sm" variant="default" asChild>
                      <span>記録する</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
