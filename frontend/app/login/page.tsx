import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/LoginForm"
import { Card } from "@/components/ui/card"

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    redirect("/")
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <LoginForm />
      </Card>
    </div>
  )
} 