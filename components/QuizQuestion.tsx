"use client"

import { useQuizQuestion } from "../hooks/useQuizQuestion"

/**
 * Type definition for the QuizQuestion component props
 */
export interface QuizQuestionProps {
  question: string
  options: string[]
  correctAnswer: string
  source: string
  onAnswerSelected: (isCorrect: boolean) => void
}

/**
 * QuizQuestion component displays a single quiz question with multiple options
 * and handles user selection with visual feedback
 */
export default function QuizQuestion({
  question,
  options,
  correctAnswer,
  source,
  onAnswerSelected
}: QuizQuestionProps) {
  const {
    isAnswered,
    handleOptionClick,
    getOptionClass
  } = useQuizQuestion(correctAnswer, onAnswerSelected)

  return (
    <div 
      className="bg-white shadow rounded-lg p-6 mb-6"
      role="region"
      aria-label="Quiz question"
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {question}
      </h3>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`w-full text-left p-3 border rounded-md transition-colors ${getOptionClass(option)}`}
            disabled={isAnswered}
            aria-label={option}
            tabIndex={isAnswered ? -1 : 0}
          >
            {option}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 italic">
        Source: {source}
      </div>
    </div>
  )
}

