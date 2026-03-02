import type { Student, StudentChart, Lesson, LessonPhoto } from "@/types/database"

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "田中 花子",
    name_kana: "たなか はなこ",
    email: "hanako@example.com",
    phone: "090-1234-5678",
    lesson_day: "火曜日",
    start_date: "2025-04-01",
    status: "active",
    memo: "左利き。丁寧に書く意識が高い。",
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2025-04-01T00:00:00Z",
  },
  {
    id: "s2",
    name: "鈴木 太郎",
    name_kana: "すずき たろう",
    email: "taro@example.com",
    phone: "090-9876-5432",
    lesson_day: "木曜日",
    start_date: "2025-06-15",
    status: "active",
    memo: "仕事で手書きが必要。実用的な美文字を希望。",
    created_at: "2025-06-15T00:00:00Z",
    updated_at: "2025-06-15T00:00:00Z",
  },
  {
    id: "s3",
    name: "山田 美咲",
    name_kana: "やまだ みさき",
    email: null,
    phone: "080-1111-2222",
    lesson_day: "土曜日",
    start_date: "2025-01-10",
    status: "active",
    memo: null,
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2025-01-10T00:00:00Z",
  },
  {
    id: "s4",
    name: "佐藤 健一",
    name_kana: "さとう けんいち",
    email: "kenichi@example.com",
    phone: null,
    lesson_day: "水曜日",
    start_date: "2024-09-01",
    status: "graduated",
    memo: "ボールペン字検定3級合格。",
    created_at: "2024-09-01T00:00:00Z",
    updated_at: "2025-12-01T00:00:00Z",
  },
  {
    id: "s5",
    name: "高橋 あゆみ",
    name_kana: "たかはし あゆみ",
    email: null,
    phone: null,
    lesson_day: "火曜日",
    start_date: "2025-10-01",
    status: "inactive",
    memo: "産休で一時休会中。2026年4月復帰予定。",
    created_at: "2025-10-01T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
  },
]

export const mockCharts: Record<string, StudentChart> = {
  s1: {
    id: "c1",
    student_id: "s1",
    handwriting_traits: "右上がり傾向。はねが弱く、とめが不安定。文字の大きさにばらつきがある。",
    coaching_policy: "基本筆順の定着を優先。一画一画を丁寧に意識させる。はねの練習を多めに。",
    strengths: "バランス感覚が良い。練習熱心で宿題も欠かさない。",
    areas_to_improve: "はらいの方向、はねの力加減、文字サイズの統一",
    goals: "年賀状を美文字で書けるようになる（2026年末目標）",
    created_at: "2025-04-01T00:00:00Z",
    updated_at: "2026-02-20T00:00:00Z",
  },
  s2: {
    id: "c2",
    student_id: "s2",
    handwriting_traits: "筆圧が強い。字が小さくなりがち。速書きの癖がある。",
    coaching_policy: "ゆっくり書く練習から。ボールペンの持ち方を矯正中。",
    strengths: "集中力が高い。理論的に理解しようとする姿勢が良い。",
    areas_to_improve: "筆圧コントロール、文字の大きさ、余白の取り方",
    goals: "ビジネス文書を美しく書く。名刺交換時に褒められる字を目指す。",
    created_at: "2025-06-15T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z",
  },
  s3: {
    id: "c3",
    student_id: "s3",
    handwriting_traits: "丸文字傾向。全体的に柔らかい印象。",
    coaching_policy: "角のある文字の練習を取り入れ、メリハリをつける。",
    strengths: "筆運びが滑らか。ひらがなが得意。",
    areas_to_improve: "漢字の画数が多い字のバランス、とめ・はね・はらいの区別",
    goals: "筆ペンで御祝儀袋を書けるようになる。",
    created_at: "2025-01-10T00:00:00Z",
    updated_at: "2026-01-20T00:00:00Z",
  },
}

export const mockLessons: Lesson[] = [
  {
    id: "l1",
    student_id: "s1",
    lesson_date: "2026-02-25",
    lesson_number: 12,
    topic: "ひらがな「あ」「い」「う」の復習",
    coach_note: "前回よりはねが安定してきた。「あ」の最後の払いが特に良くなった。",
    homework: "「あいうえお」を1日10回ずつ練習。特に「う」の丸みを意識。",
    created_at: "2026-02-25T00:00:00Z",
    updated_at: "2026-02-25T00:00:00Z",
  },
  {
    id: "l2",
    student_id: "s2",
    lesson_date: "2026-02-27",
    lesson_number: 8,
    topic: "カタカナ「ア」〜「コ」",
    coach_note: "筆圧が以前より改善。直線の安定感が出てきた。",
    homework: "カタカナ「ア」〜「コ」各5回。ゆっくり丁寧に。",
    created_at: "2026-02-27T00:00:00Z",
    updated_at: "2026-02-27T00:00:00Z",
  },
  {
    id: "l3",
    student_id: "s1",
    lesson_date: "2026-02-18",
    lesson_number: 11,
    topic: "漢字「永」の字 〜 基本8画の練習",
    coach_note: "「永字八法」をベースに練習。はねとはらいの区別がまだ曖昧。",
    homework: "「永」を毎日5回。各画の名称も覚える。",
    created_at: "2026-02-18T00:00:00Z",
    updated_at: "2026-02-18T00:00:00Z",
  },
  {
    id: "l4",
    student_id: "s3",
    lesson_date: "2026-03-01",
    lesson_number: 15,
    topic: "筆ペンの基礎 〜 縦線・横線",
    coach_note: "初めての筆ペン。持ち方は良いが力加減に慣れが必要。楽しそうに取り組んでいた。",
    homework: "筆ペンで直線の練習。太い線と細い線を交互に。",
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "l5",
    student_id: "s2",
    lesson_date: "2026-02-20",
    lesson_number: 7,
    topic: "ボールペンの持ち方矯正",
    coach_note: "矯正グリップを使用。30分の練習で持ち方が安定してきた。",
    homework: "矯正グリップ付きで毎日15分の自由練習。",
    created_at: "2026-02-20T00:00:00Z",
    updated_at: "2026-02-20T00:00:00Z",
  },
]

export const mockPhotos: LessonPhoto[] = [
  {
    id: "p1",
    lesson_id: "l1",
    photo_type: "before",
    storage_path: "/mock-photos/l1-before.png",
    display_order: 0,
    caption: "「あ」「い」「う」練習前",
    comment: "右上がりが目立つ。払いが短い。",
    created_at: "2026-02-25T00:00:00Z",
    updated_at: "2026-02-25T00:00:00Z",
  },
  {
    id: "p2",
    lesson_id: "l1",
    photo_type: "after",
    storage_path: "/mock-photos/l1-after.png",
    display_order: 1,
    caption: "「あ」「い」「う」練習後",
    comment: "払いの方向が改善。バランスも良くなった。",
    created_at: "2026-02-25T00:00:00Z",
    updated_at: "2026-02-25T00:00:00Z",
  },
  {
    id: "p3",
    lesson_id: "l3",
    photo_type: "before",
    storage_path: "/mock-photos/l3-before.png",
    display_order: 0,
    caption: "「永」練習前",
    comment: null,
    created_at: "2026-02-18T00:00:00Z",
    updated_at: "2026-02-18T00:00:00Z",
  },
  {
    id: "p4",
    lesson_id: "l3",
    photo_type: "after",
    storage_path: "/mock-photos/l3-after.png",
    display_order: 1,
    caption: "「永」練習後",
    comment: "はねが良くなった。はらいはもう少し練習が必要。",
    created_at: "2026-02-18T00:00:00Z",
    updated_at: "2026-02-18T00:00:00Z",
  },
]

// Helper functions
export function getMockStudent(id: string) {
  return mockStudents.find((s) => s.id === id) ?? null
}

export function getMockChart(studentId: string) {
  return mockCharts[studentId] ?? null
}

export function getMockLessonsForStudent(studentId: string) {
  return mockLessons
    .filter((l) => l.student_id === studentId)
    .sort((a, b) => b.lesson_date.localeCompare(a.lesson_date))
}

export function getMockLesson(lessonId: string) {
  return mockLessons.find((l) => l.id === lessonId) ?? null
}

export function getMockPhotosForLesson(lessonId: string) {
  return mockPhotos
    .filter((p) => p.lesson_id === lessonId)
    .sort((a, b) => a.display_order - b.display_order)
}

export function getMockRecentLessons(limit = 5) {
  return mockLessons
    .sort((a, b) => b.lesson_date.localeCompare(a.lesson_date))
    .slice(0, limit)
    .map((lesson) => ({
      ...lesson,
      students: { name: mockStudents.find((s) => s.id === lesson.student_id)?.name ?? "" },
    }))
}

export function getMockLessonsWithPhotos(studentId: string) {
  return mockLessons
    .filter((l) => l.student_id === studentId)
    .sort((a, b) => a.lesson_date.localeCompare(b.lesson_date))
    .map((lesson) => ({
      ...lesson,
      lesson_photos: mockPhotos.filter((p) => p.lesson_id === lesson.id),
    }))
}
