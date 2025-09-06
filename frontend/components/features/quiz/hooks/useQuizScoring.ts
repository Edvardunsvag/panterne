import { useState } from 'react';
import { apiClient, QuizAttemptDto, LeaderboardEntryDto, DailyLeaderboardDto, AllTimePodiumStatsDto } from '@/lib/api-client';

export const useQuizScoring = () => {
  const [submitting, setSubmitting] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardEntryDto[]>([]);
  const [historicalLeaderboards, setHistoricalLeaderboards] = useState<DailyLeaderboardDto[]>([]);
  const [podiumStats, setPodiumStats] = useState<AllTimePodiumStatsDto[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [loadingDailyLeaderboard, setLoadingDailyLeaderboard] = useState(false);
  const [loadingHistoricalLeaderboards, setLoadingHistoricalLeaderboards] = useState(false);
  const [loadingPodiumStats, setLoadingPodiumStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitQuizResult = async (gitHubId: string, attempts: QuizAttemptDto[], category: string) => {
    setSubmitting(true);
    setError(null);

    try {
      const result = await apiClient.submitQuizResult({
        gitHubId: gitHubId,
        quizResult: { 
          attempts: attempts,
          category: category
        }
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

  const loadDailyLeaderboard = async (category: string, date?: string, limit: number = 10) => {
    setLoadingDailyLeaderboard(true);
    setError(null);

    try {
      const result = await apiClient.getDailyLeaderboard(category, date, limit);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setDailyLeaderboard(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load daily leaderboard');
    } finally {
      setLoadingDailyLeaderboard(false);
    }
  };

  const loadHistoricalLeaderboards = async (category: string, days: number = 7) => {
    setLoadingHistoricalLeaderboards(true);
    setError(null);

    try {
      const result = await apiClient.getHistoricalLeaderboards(category, days);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setHistoricalLeaderboards(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load historical leaderboards');
    } finally {
      setLoadingHistoricalLeaderboards(false);
    }
  };

  const loadPodiumStats = async (category: string, limit: number = 10) => {
    setLoadingPodiumStats(true);
    setError(null);

    try {
      const result = await apiClient.getAllTimePodiumStats(category, limit);
      
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setPodiumStats(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load podium stats');
    } finally {
      setLoadingPodiumStats(false);
    }
  };

  return {
    submitQuizResult,
    loadLeaderboard,
    loadDailyLeaderboard,
    loadHistoricalLeaderboards,
    loadPodiumStats,
    submitting,
    leaderboard,
    dailyLeaderboard,
    historicalLeaderboards,
    podiumStats,
    loadingLeaderboard,
    loadingDailyLeaderboard,
    loadingHistoricalLeaderboards,
    loadingPodiumStats,
    error
  };
};
