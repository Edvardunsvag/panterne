import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiClient, UserDto, UserScoreDto } from '@/lib/api-client';

export const useUser = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserDto | null>(null);
  const [userScores, setUserScores] = useState<UserScoreDto[]>([]);
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
        await loadUserScores(syncResult.data.id ?? '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync user');
    } finally {
      setLoading(false);
    }
  };

  const loadUserScores = async (userId: string) => {
    const scoresResult = await apiClient.getUserScores(userId);
    if (scoresResult.data) {
      setUserScores(scoresResult.data);
    }
  };

  const refreshUserScores = async () => {
    if (user && user.id) {
      await loadUserScores(user.id);
    }
  };

  useEffect(() => {
    if (authUser) {
      syncUser();
    }
  }, [authUser]);

  return {
    user,
    userScores,
    loading,
    error,
    syncUser,
    refreshUserScores
  };
}; 