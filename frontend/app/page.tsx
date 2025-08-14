'use client'
import QuizGenerator from "@/components/QuizGenerator"
import { UserScore } from "@/components/UserScore"
import { Leaderboard } from "@/components/Leaderboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "next-auth/react"
import SignInButton from "@/components/SignInButton"

export default function Home() {
  const { data: session, status } = useSession()

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Panter Quiz 🐭</h1>
        
        <Tabs defaultValue="quiz" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="scores" disabled={!session}>
              My Scores {!session && "(Login Required)"}
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
              {session ? (
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