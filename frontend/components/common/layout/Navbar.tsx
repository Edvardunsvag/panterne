'use client'
import { useAuth } from "@/lib/auth-context"
import { SignOutButton } from "@/components/features/auth/components/SignOutButton"

export function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="w-full h-16 border-b border-border bg-background">
      <div className="max-w-6xl h-full mx-auto px-4 flex items-center justify-between">
        <div className="text-xl font-semibold">
          Panterne Quiz 🐭
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {user.email}
              </span>
              <SignOutButton />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 