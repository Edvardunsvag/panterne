import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient, UserDto, UserScoreDto } from '@/lib/api-client';

export const useUser = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserDto | null>(null);
  const [userScores, setUserScores] = useState<UserScoreDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncUser = async () => {
    if (!session?.user) return;

    setLoading(true);
    setError(null);

    try {
      const gitHubId = (session as any).user.id || session.user.email || '';
      
      const syncResult = await apiClient.syncUser({
        gitHubId,
        email: session.user.email || '',
        name: session.user.name || '',
        avatarUrl: session.user.image || ''
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
    if (session?.user) {
      syncUser();
    }
  }, [session]);

  return {
    user,
    userScores,
    loading,
    error,
    syncUser,
    refreshUserScores
  };
}; 