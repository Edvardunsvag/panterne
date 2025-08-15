"use client"

import { useQuiz } from "@/components/features/quiz/hooks/useQuiz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"
import SignInButton from "@/components/features/auth/components/SignInButton"
import { CheckCircle, XCircle, Trophy, Clock } from "lucide-react"

/**
 * QuizGenerator component with manual submission
 */
export default function QuizGenerator() {
  const { data: session } = useSession()
  const {
    questions,
    loading,
    error,
    category,
    score,
    currentQuestionIndex,
    isCompleted,
    isSubmitted,
    submitting,
    CATEGORIES,
    setCategory,
    loadQuestions,
    handleAnswerSelected,
    startNewQuiz,
    getCurrentQuestion,
    getProgress,
    submitQuiz,
    canSubmit
  } = useQuiz()

  const currentQuestion = getCurrentQuestion()
  const progress = getProgress()

  const handleOptionClick = (optionIndex: number) => {
    handleAnswerSelected(optionIndex)
  }

  const handleSubmit = async () => {
    const success = await submitQuiz()
    if (success) {
      // Quiz submitted successfully
    }
  }

  return (
    <div className="space-y-6">
      {/* Quiz Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={loading || (questions.length > 0 && !isCompleted)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          
          <Button
            onClick={() => loadQuestions(10)}
            disabled={loading || (questions.length > 0 && !isCompleted)}
            className="w-full"
          >
            {loading ? "Loading Quiz..." : "Start New Quiz"}
          </Button>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-700">
              <XCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Progress */}
      {questions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Quiz - {category}</h2>
                <div className="text-sm text-gray-600">
                  Question {progress.current} of {progress.total}
                </div>
              </div>
              
              <Progress value={progress.percentage} className="w-full" />
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Trophy className="w-4 h-4 mr-1" />
                  Score: {score.correct}/{score.total}
                </div>
                {isCompleted && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Quiz Completed!
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Question */}
      {currentQuestion && !isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  variant="outline"
                  className="w-full text-left justify-start h-auto p-4 whitespace-normal"
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </Button>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-500 italic">
              Source: {currentQuestion.source}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Summary & Submit */}
      {isCompleted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Quiz Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {score.correct}
                  </div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-700">
                    {score.total}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold">
                  {((score.correct / score.total) * 100).toFixed(1)}% Accuracy
                </div>
              </div>
            </div>

            {!session ? (
              <div className="text-center space-y-4">
                <p className="text-gray-600">Sign in to save your score and compete on the leaderboard!</p>
                <SignInButton />
              </div>
            ) : isSubmitted ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg font-semibold">Score Submitted Successfully!</span>
                </div>
                <p className="text-gray-600">Your score has been saved and the leaderboard has been updated.</p>
                <Button onClick={startNewQuiz} className="w-full">
                  Take Another Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || submitting}
                  className="w-full"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4 mr-2" />
                      Submit Score
                    </>
                  )}
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Submit your score to save it and appear on the leaderboard
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

