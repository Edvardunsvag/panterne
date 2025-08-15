import { useState } from "react";
import { useSession } from "next-auth/react";
import { apiClient, QuestionDto, QuizAttemptDto } from "@/lib/api-client";
import { useQuizScoring } from "./useQuizScoring";
import { useUser } from "@/components/features/user/hooks/useUser";
import { QUIZ_CATEGORIES, QuizCategory } from "@/lib/constants/categories";

interface QuizState {
  questions: QuestionDto[];
  loading: boolean;
  error: string | null;
  category: QuizCategory;
  score: {
    correct: number;
    total: number;
  };
  currentQuestionIndex: number;
  attempts: QuizAttemptDto[];  // Using generated type directly
  quizStartTime: number;
  questionStartTime: number;
  isCompleted: boolean;
  isSubmitted: boolean;
}

export const useQuiz = () => {
  const { data: session } = useSession();
  const { submitQuizResult, submitting } = useQuizScoring();
  const { user, refreshUserScores } = useUser();
  
  const [state, setState] = useState<QuizState>({
    questions: [],
    loading: false,
    error: null,
    category: "General Knowledge",
    score: { correct: 0, total: 0 },
    currentQuestionIndex: 0,
    attempts: [],
    quizStartTime: 0,
    questionStartTime: 0,
    isCompleted: false,
    isSubmitted: false
  });

  const setCategory = (category: QuizCategory) => {
    setState(prev => ({ ...prev, category }));
  };

  const startNewQuiz = () => {
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      score: { correct: 0, total: 0 },
      attempts: [],
      quizStartTime: Date.now(),
      questionStartTime: Date.now(),
      isCompleted: false,
      isSubmitted: false,
      error: null
    }));
  };

  const handleAnswerSelected = (selectedAnswer: number) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    const timeSpent = Math.floor((Date.now() - state.questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    const attempt: QuizAttemptDto = {
      questionId: currentQuestion.id,
      selectedAnswer,
      timeSpentSeconds: timeSpent
    };

    setState(prev => ({
      ...prev,
      score: {
        correct: isCorrect ? prev.score.correct + 1 : prev.score.correct,
        total: prev.score.total + 1,
      },
      attempts: [...prev.attempts, attempt],
      questionStartTime: Date.now()
    }));

    // Move to next question or mark as completed
    if (state.currentQuestionIndex < state.questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    } else {
      // Quiz completed - but don't auto-submit
      setState(prev => ({ ...prev, isCompleted: true }));
    }
  };

  const submitQuiz = async () => {
    if (!session?.user || !user || state.attempts.length === 0) {
      setState(prev => ({
        ...prev,
        error: 'Please complete the quiz before submitting.'
      }));
      return false;
    }

    try {
      const gitHubId = (session as any).user.id || session.user.email || '';
      
      const success = await submitQuizResult(gitHubId, state.attempts);
      
      if (success) {
        setState(prev => ({ ...prev, isSubmitted: true, error: null }));
        // Refresh user scores to show updated data
        await refreshUserScores();
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to submit quiz results. Please try again.'
        }));
        return false;
      }
    } catch (error) {
      console.error('Failed to submit quiz results:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to save quiz results. Please try again.'
      }));
      return false;
    }
  };

  const loadQuestions = async (count: number = 10) => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
      questions: [],
      score: { correct: 0, total: 0 },
      currentQuestionIndex: 0,
      attempts: [],
      quizStartTime: Date.now(),
      questionStartTime: Date.now(),
      isCompleted: false,
      isSubmitted: false
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

  const getCurrentQuestion = () => {
    return state.questions[state.currentQuestionIndex];
  };

  const getProgress = () => {
    return {
      current: state.currentQuestionIndex + 1,
      total: state.questions.length,
      percentage: state.questions.length > 0 ? ((state.currentQuestionIndex + 1) / state.questions.length) * 100 : 0
    };
  };

  const canSubmit = () => {
    return state.isCompleted && !state.isSubmitted && state.attempts.length > 0;
  };

  return {
    ...state,
    submitting,
    CATEGORIES: QUIZ_CATEGORIES,
    setCategory,
    loadQuestions,
    handleAnswerSelected,
    startNewQuiz,
    getCurrentQuestion,
    getProgress,
    submitQuiz,
    canSubmit
  };
}; 