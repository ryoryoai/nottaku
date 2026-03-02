import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockStudents } from "@/lib/mock-data"

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: filterStatus } = await searchParams

  let students = mockStudents
  if (filterStatus && filterStatus !== "all") {
    students = students.filter((s) => s.status === filterStatus)
  }

  const statusLabels: Record<string, string> = {
    active: "受講中",
    inactive: "休会中",
    graduated: "卒業",
  }

  const statusVariant = (status: string) => {
    if (status === "active") return "default" as const
    if (status === "graduated") return "secondary" as const
    return "outline" as const
  }

  const currentFilter = filterStatus || "all"

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">生徒一覧</h1>
          <Button asChild>
            <Link href="/students/new">新規登録</Link>
          </Button>
        </div>

        <div className="mb-4 flex gap-2">
          {[
            { key: "all", label: "すべて" },
            { key: "active", label: "受講中" },
            { key: "inactive", label: "休会中" },
            { key: "graduated", label: "卒業" },
          ].map((filter) => (
            <Button
              key={filter.key}
              variant={currentFilter === filter.key ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link
                href={
                  filter.key === "all"
                    ? "/students"
                    : `/students?status=${filter.key}`
                }
              >
                {filter.label}
              </Link>
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {students.map((student) => (
            <Link key={student.id} href={`/students/${student.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="font-medium">{student.name}</p>
                    {student.name_kana && (
                      <p className="text-xs text-muted-foreground">
                        {student.name_kana}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {student.lesson_day && (
                      <span className="text-sm text-muted-foreground">
                        {student.lesson_day}
                      </span>
                    )}
                    <Badge variant={statusVariant(student.status)}>
                      {statusLabels[student.status] || student.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
