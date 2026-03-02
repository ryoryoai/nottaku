import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PhotoGallery } from "@/components/photo-gallery"
import { LessonEditForm } from "./lesson-edit-form"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  getMockStudent,
  getMockLesson,
  getMockPhotosForLesson,
} from "@/lib/mock-data"

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>
}) {
  const { id: studentId, lessonId } = await params

  const student = getMockStudent(studentId)
  if (!student) notFound()

  const lesson = getMockLesson(lessonId)
  if (!lesson) notFound()

  const photos = getMockPhotosForLesson(lessonId)

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Link
                href={`/students/${studentId}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {student.name}
              </Link>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm font-medium">レッスン詳細</span>
            </div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              {lesson.topic || "テーマ未設定"}
              {lesson.lesson_number && (
                <Badge variant="secondary">第{lesson.lesson_number}回</Badge>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lesson.lesson_date}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/students/${studentId}`}>生徒詳細に戻る</Link>
          </Button>
        </div>

        <div className="space-y-6">
          <LessonEditForm lesson={lesson} studentId={studentId} />

          <PhotoGallery
            photos={photos}
            supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
          />
        </div>
      </main>
    </div>
  )
}
