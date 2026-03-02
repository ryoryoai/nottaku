import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { ProgressTimeline } from "@/components/progress-timeline"
import { Button } from "@/components/ui/button"
import { getMockStudent, getMockLessonsWithPhotos } from "@/lib/mock-data"

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const student = getMockStudent(id)
  if (!student) notFound()

  const lessons = getMockLessonsWithPhotos(id)

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Link
                href={`/students/${id}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {student.name}
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">進捗レポート</span>
            </div>
            <h1 className="text-2xl font-bold">進捗レポート</h1>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/students/${id}`}>生徒詳細に戻る</Link>
          </Button>
        </div>

        <ProgressTimeline
          lessons={lessons}
          studentId={id}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
        />
      </main>
    </div>
  )
}
