"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "ダッシュボード", href: "/" },
  { name: "生徒一覧", href: "/students" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold">
            nottaku
          </Link>
          <nav className="flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <span className="text-xs text-muted-foreground">モックモード</span>
      </div>
    </header>
  )
}
