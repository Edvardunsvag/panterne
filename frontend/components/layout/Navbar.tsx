import { auth } from "@/auth"
import { SignOutButton } from "@/components/auth/SignOutButton"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="w-full h-16 border-b border-border bg-background">
      <div className="max-w-6xl h-full mx-auto px-4 flex items-center justify-between">
        <div className="text-xl font-semibold">
          Panterne Quiz 🐭
        </div>
        
        <div className="flex items-center gap-4">
          {session && (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground text-sm">
                {session.user?.email}
              </span>
              <SignOutButton 
                userImage={session.user?.image}
                userEmail={session.user?.email}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 