'use client'
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Github } from "lucide-react"

export function LoginForm() {
  const { signInWithGitHub } = useAuth()

  return (
    <>
      <CardHeader>
        <h1 className="text-center text-3xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-center mt-2 text-muted-foreground">Sign in to your account to continue</p>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 h-11 hover:bg-accent"
          onClick={signInWithGitHub}
          aria-label="Sign in with GitHub"
        >
          <Github className="w-5 h-5" />
          Sign in with GitHub
        </Button>
      </CardContent>
    </>
  )
} 