"use client"

import { useQuiz } from "@/components/features/quiz/hooks/useQuiz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"
import SignInButton from "@/components/features/auth/components/SignInButton"
import { CheckCircle, XCircle, Trophy, Clock, Sparkles, Zap, Target, Star } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { createConfetti, createConfettiFromButton, getOptionBorderColor, getOptionClass } from "../styles/helpers"

/**
 * Enhanced QuizGenerator component with animations and visual feedback
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

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [questionKey, setQuestionKey] = useState(0)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  const currentQuestion = getCurrentQuestion()
  const progress = getProgress()

  // Reset state when moving to next question
  useEffect(() => {
    setSelectedAnswer(null)
    setIsAnswered(false)
    setShowFeedback(false)
    setQuestionKey(prev => prev + 1)
    optionRefs.current = []
  }, [currentQuestionIndex])

  const handleOptionClick = (optionIndex: number) => {
    if (isAnswered) return

    setSelectedAnswer(optionIndex)
    setIsAnswered(true)
    setShowFeedback(true)

    const isCorrect = optionIndex === currentQuestion?.correctIndex

    // Create confetti for correct answers from the button
    if (isCorrect) {
      const correctButton = optionRefs.current[currentQuestion.correctIndex ?? 0]
      createConfettiFromButton(correctButton)
    }

    // Delay moving to next question to show feedback
    setTimeout(() => {
      handleAnswerSelected(optionIndex)
      setShowFeedback(false)
    }, 1500)
  }

  const handleSubmit = async () => {
    const success = await submitQuiz()
    if (success) {
      createConfetti()
    }
  }

  

  return (
    <div className="space-y-6">
      {/* Quiz Controls */}
      <Card className="quiz-card-enter">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Quiz Setup
          </CardTitle>
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <div className="quiz-loading w-4 h-4 mr-2 rounded-full"></div>
                Loading Quiz...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Start New Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50 quiz-card-enter">
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
        <Card className="quiz-card-enter">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Quiz - {category}
                </h2>
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  Question {progress.current} of {progress.total}
                </div>
              </div>
              
              <div className="relative">
                <Progress 
                  value={progress.percentage} 
                  className="w-full h-3 quiz-progress-bar"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full opacity-20"></div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center text-green-600">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span className="font-semibold">Score: {score.correct}/{score.total}</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <Star className="w-4 h-4 mr-1" />
                    <span>{score.total > 0 ? ((score.correct / score.total) * 100).toFixed(0) : 0}% Accuracy</span>
                  </div>
                </div>
                {isCompleted && (
                  <div className="flex items-center text-green-600 quiz-score-celebration">
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
        <Card key={questionKey} className="quiz-card-enter bg-gradient-to-br from-white to-blue-50 border border-blue-100">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl leading-relaxed flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {progress.current}
              </div>
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentQuestion.options?.map((option, index) => (
                <Button
                  key={index}
                  ref={(el) => {
                    if (optionRefs.current) {
                      optionRefs.current[index] = el
                    }
                  }}
                  onClick={() => handleOptionClick(index)}
                  variant="outline"
                  disabled={isAnswered}
                  className={`
                    ${getOptionClass(index, isAnswered, currentQuestion, selectedAnswer)}
                    ${getOptionBorderColor(index)} border-l-4
                    text-gray-800 font-medium
                  `}
                >
                  <div className="flex items-center gap-4 w-full">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 text-left">{option}</span>
                    {isAnswered && index === currentQuestion.correctIndex && (
                      <CheckCircle className="w-5 h-5 text-green-600 animate-bounce" />
                    )}
                    {isAnswered && index === selectedAnswer && index !== currentQuestion.correctIndex && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Feedback Message */}
            {showFeedback && (
              <div className="mt-6 text-center">
                {selectedAnswer === currentQuestion.correctIndex ? (
                  <div className="quiz-score-celebration bg-green-50 text-green-700 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-semibold text-lg">Excellent! That's correct! 🎉</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                    <div className="text-center">
                      <span className="font-semibold">Not quite right!</span>
                      <br />
                      <span className="text-sm">The correct answer was: <strong>{currentQuestion.options?.[currentQuestion.correctIndex ?? 0]}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="italic">Source: {currentQuestion.source}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quiz Summary & Submit */}
      {isCompleted && (
        <Card className="quiz-complete-celebration">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Trophy className="w-8 h-8 mr-3 text-yellow-600" />
              Quiz Complete! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="quiz-score-celebration">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {score.correct}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Correct</div>
                </div>
                <div className="quiz-score-celebration" style={{animationDelay: '0.2s'}}>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {score.total}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total</div>
                </div>
                <div className="quiz-score-celebration" style={{animationDelay: '0.4s'}}>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {((score.correct / score.total) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Accuracy</div>
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
                <div className="flex items-center justify-center text-green-600 quiz-score-celebration">
                  <CheckCircle className="w-8 h-8 mr-3" />
                  <span className="text-xl font-semibold">Score Submitted Successfully!</span>
                </div>
                <p className="text-gray-600">Your score has been saved and the leaderboard has been updated.</p>
                <Button 
                  onClick={startNewQuiz} 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-[1.05]"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Take Another Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit() || submitting}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                  size="lg"
                >
                  {submitting ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Trophy className="w-5 h-5 mr-2" />
                      Submit Score & Celebrate!
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