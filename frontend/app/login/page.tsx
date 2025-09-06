'use client'
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/features/auth/components/LoginForm"
import { Card } from "@/components/ui/card"
import { useEffect } from "react"

export default function LoginPage() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && user) {
      redirect("/")
    }
  }, [user, loading])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md">
        <LoginForm />
      </Card>
    </div>
  )
} 