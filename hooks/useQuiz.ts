import { useState } from "react";

interface QuizQuestionType {
  question: string;
  options: string[];
  correctAnswer: string;
  source: string;
}

interface QuizState {
  questions: QuizQuestionType[];
  loading: boolean;
  error: string | null;
  category: string;
  score: {
    correct: number;
    total: number;
  };
}

const CATEGORIES = [
  "General Knowledge",
  "Science", 
  "History", 
  "Geography", 
  "Entertainment", 
  "Sports", 
  "Name of the Capitals of Europe",
  'American presidents',
];

export const useQuiz = () => {
  const [state, setState] = useState<QuizState>({
    questions: [],
    loading: false,
    error: null,
    category: "General Knowledge",
    score: { correct: 0, total: 0 }
  });

  const setCategory = (category: string) => {
    setState(prev => ({ ...prev, category }));
  };

  const handleAnswerSelected = (isCorrect: boolean) => {
    setState(prev => ({
      ...prev,
      score: {
        correct: isCorrect ? prev.score.correct + 1 : prev.score.correct,
        total: prev.score.total + 1,
      },
    }));
  };

  const generateQuiz = async () => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      questions: [],
      score: { correct: 0, total: 0 }
    }));

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: state.category }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No quiz questions were generated. Please try again.");
      }

      setState(prev => ({
        ...prev,
        questions: data.questions,
        loading: false
      }));
    } catch (err) {
      console.error("Quiz generation error:", err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred while generating the quiz",
        loading: false
      }));
    }
  };

  return {
    ...state,
    CATEGORIES,
    setCategory,
    generateQuiz,
    handleAnswerSelected
  };
}; 