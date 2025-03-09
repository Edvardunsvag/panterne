'use client'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CardContent, CardHeader } from "@/components/ui/card"
import { Github } from "lucide-react"
import styles from "./LoginForm.module.scss"

export function LoginForm() {
  const handleGithubLogin = async () => {
    await signIn("github", { redirectTo: "/" })
  }

  return (
    <>
      <CardHeader>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account to continue</p>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          className={styles.githubButton}
          onClick={handleGithubLogin}
          aria-label="Sign in with GitHub"
        >
          <Github className={styles.githubIcon} />
          Sign in with GitHub
        </Button>
      </CardContent>
    </>
  )
} 