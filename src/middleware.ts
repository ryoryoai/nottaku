import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // TODO: Supabase接続後に認証チェックを有効化
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
