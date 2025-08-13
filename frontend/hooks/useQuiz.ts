import { useState } from "react";
import { apiClient, QuestionDto } from "@/lib/api-client";

interface QuizState {
  questions: QuestionDto[];
  loading: boolean;
  error: string | null;
  category: string;
  score: {
    correct: number;
    total: number;
  };
}

const CATEGORIES = [
  "general",
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
    category: "general",
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

  const loadQuestions = async (count: number = 10) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      questions: [],
      score: { correct: 0, total: 0 }
    }));

    try {
      const response = await apiClient.getRecentQuestionsByCategory(state.category, count);

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
        throw new Error("No quiz questions were found for this category. Please try again.");
      }

      setState(prev => ({
        ...prev,
        questions: response.data!,
        loading: false
      }));
    } catch (err) {
      console.error("Quiz loading error:", err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : "An error occurred while loading quiz questions",
        loading: false
      }));
    }
  };

  return {
    ...state,
    CATEGORIES,
    setCategory,
    loadQuestions,
    handleAnswerSelected
  };
}; 