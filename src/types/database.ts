export type Student = {
  id: string
  name: string
  name_kana: string | null
  email: string | null
  phone: string | null
  lesson_day: string | null
  start_date: string | null
  status: "active" | "inactive" | "graduated"
  memo: string | null
  created_at: string
  updated_at: string
}

export type StudentChart = {
  id: string
  student_id: string
  handwriting_traits: string | null
  coaching_policy: string | null
  strengths: string | null
  areas_to_improve: string | null
  goals: string | null
  created_at: string
  updated_at: string
}

export type Lesson = {
  id: string
  student_id: string
  lesson_date: string
  lesson_number: number | null
  topic: string | null
  coach_note: string | null
  homework: string | null
  created_at: string
  updated_at: string
}

export type LessonPhoto = {
  id: string
  lesson_id: string
  photo_type: "before" | "after"
  storage_path: string
  display_order: number
  caption: string | null
  comment: string | null
  created_at: string
  updated_at: string
}

export type StudentWithChart = Student & {
  student_charts: StudentChart | null
}

export type LessonWithPhotos = Lesson & {
  lesson_photos: LessonPhoto[]
}
