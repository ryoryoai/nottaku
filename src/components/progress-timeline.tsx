"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Lesson, LessonPhoto } from "@/types/database"

type LessonWithPhotos = Lesson & {
  lesson_photos: LessonPhoto[]
}

type Props = {
  lessons: LessonWithPhotos[]
  studentId: string
  supabaseUrl: string
}

export function ProgressTimeline({ lessons, studentId, supabaseUrl }: Props) {
  const getPublicUrl = (path: string) => {
    if (path.startsWith("/")) return path
    return `${supabaseUrl}/storage/v1/object/public/lesson-photos/${path}`
  }

  if (lessons.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        レッスン記録はまだありません
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {lessons.map((lesson) => {
        const beforePhotos = lesson.lesson_photos.filter(
          (p) => p.photo_type === "before"
        )
        const afterPhotos = lesson.lesson_photos.filter(
          (p) => p.photo_type === "after"
        )

        return (
          <Link
            key={lesson.id}
            href={`/students/${studentId}/lessons/${lesson.id}`}
            className="block"
          >
            <Card className="transition-colors hover:bg-muted/50">
              <CardContent className="py-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{lesson.lesson_date}</span>
                    {lesson.lesson_number && (
                      <Badge variant="secondary">
                        第{lesson.lesson_number}回
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {lesson.topic || "テーマ未設定"}
                  </span>
                </div>

                {(beforePhotos.length > 0 || afterPhotos.length > 0) && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                        Before
                      </p>
                      {beforePhotos.length > 0 ? (
                        <div className="grid gap-1">
                          {beforePhotos.slice(0, 2).map((photo) => (
                            <div
                              key={photo.id}
                              className="relative aspect-[4/3] overflow-hidden rounded"
                            >
                              <Image
                                src={getPublicUrl(photo.storage_path)}
                                alt={photo.caption ?? "Before"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 25vw"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                          写真なし
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                        After
                      </p>
                      {afterPhotos.length > 0 ? (
                        <div className="grid gap-1">
                          {afterPhotos.slice(0, 2).map((photo) => (
                            <div
                              key={photo.id}
                              className="relative aspect-[4/3] overflow-hidden rounded"
                            >
                              <Image
                                src={getPublicUrl(photo.storage_path)}
                                alt={photo.caption ?? "After"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 25vw"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex aspect-[4/3] items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                          写真なし
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
