'use client'
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

const SignInButton = () => {
  const { signInWithGitHub } = useAuth()
  
  return (
    <Button 
      variant="outline" 
      className="flex items-center justify-center gap-2 h-11 hover:bg-accent"
      onClick={signInWithGitHub}
      aria-label="Sign in with GitHub"
    >
      <Github className="w-5 h-5" />
      Sign in with GitHub
    </Button>
  )
}

export default SignInButton