"use client"

import { useQuiz } from "../hooks/useQuiz"
import QuizQuestion from "./QuizQuestion"

/**
 * Type definition for a quiz question
 */
interface QuizQuestionType {
  question: string
  options: string[]
  correctAnswer: string
  source: string
}

/**
 * Available quiz categories
 */
const CATEGORIES = [
  "General Knowledge",
  "Science",
  "History",
  "Geography",
  "Entertainment",
  "Sports",
  "Name of the Capitals of Europe"
]

/**
 * QuizGenerator component allows users to generate and interact with quiz questions
 */
export default function QuizGenerator() {
  const {
    questions,
    loading,
    error,
    category,
    score,
    CATEGORIES,
    setCategory,
    generateQuiz,
    handleAnswerSelected
  } = useQuiz()

  return (
    <div className="space-y-6">
      {/* Quiz Controls */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label 
            htmlFor="category" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
            aria-label="Quiz category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={generateQuiz}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:bg-blue-400"
          aria-busy={loading}
          aria-label={loading ? "Generating quiz questions" : "Generate quiz questions"}
        >
          {loading ? "Generating Quiz..." : "Generate Quiz Questions"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      {/* Quiz Results */}
      {questions.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {category} Quiz
            </h2>
            <div 
              className="text-sm font-medium text-gray-600"
              aria-live="polite"
              aria-label={`Current score: ${score.correct} correct out of ${score.total} questions answered`}
            >
              Score: {score.correct}/{score.total}
            </div>
          </div>
          <div className="space-y-6">
            {questions.map((q, index) => (
              <QuizQuestion
                key={index}
                question={q.question}
                options={q.options}
                correctAnswer={q.correctAnswer}
                source={q.source}
                onAnswerSelected={handleAnswerSelected}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

