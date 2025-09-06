import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient, UserDto, QuizSessionDto } from '@/lib/api-client';

export const useUser = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserDto | null>(null);
  const [quizSessions, setQuizSessions] = useState<QuizSessionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncUser = async () => {
    if (!authUser) return;

    setLoading(true);
    setError(null);

    try {
      const gitHubId = authUser.id || authUser.email || '';
      
      const syncResult = await apiClient.syncUser({
        gitHubId,
        email: authUser.email || '',
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || '',
        avatarUrl: authUser.user_metadata?.avatar_url || ''
      });

      if (syncResult.error) {
        setError(syncResult.error);
      } else if (syncResult.data) {
        setUser(syncResult.data);
        await loadUserQuizSessions(syncResult.data.id ?? '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync user');
    } finally {
      setLoading(false);
    }
  };

  const loadUserQuizSessions = async (userId: string, category?: string) => {
    const sessionsResult = await apiClient.getUserQuizSessions(userId, category);
    if (sessionsResult.data) {
      setQuizSessions(sessionsResult.data);
    }
  };

  const refreshUserQuizSessions = async (category?: string) => {
    if (user && user.id) {
      await loadUserQuizSessions(user.id, category);
    }
  };

  useEffect(() => {
    if (authUser) {
      syncUser();
    }
  }, [authUser]);

  return {
    user,
    quizSessions,
    loading,
    error,
    syncUser,
    refreshUserQuizSessions
  };
}; 