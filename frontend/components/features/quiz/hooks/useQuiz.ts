import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
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
  const { user: authUser } = useAuth();
  const { submitQuizResult, submitting } = useQuizScoring();
  const { user, refreshUserQuizSessions } = useUser();
  
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
    console.log('submitQuiz', user);
    if (!authUser) return false;

    const gitHubId = authUser.id || authUser.email || '';
    const success = await submitQuizResult(gitHubId, state.attempts, state.category);
    
    if (success) {
      setState(prev => ({ ...prev, isSubmitted: true }));
      // Only refresh if user is available, otherwise it will be refreshed when user syncs
      if (user) {
        await refreshUserQuizSessions();
      }
    }
    
    return success;
  };

  const loadQuestions = async (category: QuizCategory, count: number = 10) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiClient.getRecentQuestionsByCategory(category, count);
      
      if (result.error) {
        setState(prev => ({ ...prev, error: result.error!, loading: false }));
      } else if (result.data) {
        setState(prev => ({
          ...prev,
          questions: result.data!,
          loading: false,
          currentQuestionIndex: 0,
          score: { correct: 0, total: 0 },
          attempts: [],
          quizStartTime: Date.now(),
          questionStartTime: Date.now(),
          isCompleted: false,
          isSubmitted: false
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load questions',
        loading: false
      }));
    }
  };

  const getCurrentQuestion = () => {
    return state.questions[state.currentQuestionIndex];
  };

  const getProgress = () => {
    if (state.questions.length === 0) return 0;
    return ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
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