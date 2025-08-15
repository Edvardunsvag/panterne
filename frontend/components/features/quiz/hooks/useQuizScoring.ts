import { useState } from 'react';
import { apiClient, QuizAttemptDto, LeaderboardEntryDto } from '@/lib/api-client';

export const useQuizScoring = () => {
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQuizResult = async (gitHubId: string, attempts: QuizAttemptDto[]) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await apiClient.submitQuizResult({
        gitHubId: gitHubId,  // camelCase as per generated type
        quizResult: { attempts: attempts }  // camelCase as per generated type
      });

      if (result.error) {
        setError(result.error);
        return false;
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz result');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const loadLeaderboard = async (category: string, limit: number = 10) => {
    setLoadingLeaderboard(true);
    setError(null);

    try {
      const result = await apiClient.getLeaderboard(category, limit);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setLeaderboard(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  return {
    submitQuizResult,
    loadLeaderboard,
    submitting,
    leaderboard,
    loadingLeaderboard,
    error
  };
};
