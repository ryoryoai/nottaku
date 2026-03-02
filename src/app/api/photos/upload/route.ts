// このAPIルートはSupabase接続後に有効化
// 現在はクライアントサイドでの写真管理を使用
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "写真アップロードAPIは準備中です" },
    { status: 503 }
  )
}
