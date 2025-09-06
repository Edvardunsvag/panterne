'use client'
import QuizGenerator from "@/components/features/quiz/components/QuizGenerator"
import { UserScore } from "@/components/features/user/components/UserScore"
import { Leaderboard } from "@/components/features/leaderboard/components/Leaderboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import SignInButton from "@/components/features/auth/components/SignInButton"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Panter Quiz 🐭</h1>
        
        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="scores" disabled={!user}>
              My Scores {!user && "(Login Required)"}
            </TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quiz" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <QuizGenerator />
            </div>
          </TabsContent>
          
          <TabsContent value="scores" className="mt-6">
            <div className="max-w-4xl mx-auto">
              {user ? (
                <UserScore />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">Please sign in to view your scores</p>
                  <SignInButton />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="leaderboard" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <Leaderboard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}