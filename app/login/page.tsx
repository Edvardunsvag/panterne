import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/LoginForm"
import { Card } from "@/components/ui/card"
import styles from "./login.module.scss"

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    redirect("/")
  }

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <LoginForm />
      </Card>
    </div>
  )
} 