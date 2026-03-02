"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateStudent(id: string, formData: FormData) {
  const supabase = await createServerSupabaseClient()

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

  const { error } = await supabase.from("students").update(data).eq("id", id)

  if (error) {
    throw new Error("更新に失敗しました: " + error.message)
  }

  revalidatePath(`/students/${id}`)
}

export async function deleteStudent(id: string) {
  const supabase = await createServerSupabaseClient()

  const { error } = await supabase.from("students").delete().eq("id", id)

  if (error) {
    throw new Error("削除に失敗しました: " + error.message)
  }

  redirect("/students")
}
