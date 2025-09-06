'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp, Clock, Calendar } from 'lucide-react';
import { useUser } from '@/components/features/user/hooks/useUser';

export const UserScore = () => {
  const { user, quizSessions, loading, error } = useUser();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!user || quizSessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No quiz results yet. Start taking quizzes to see your progress!</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number | undefined) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Quiz Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quizSessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{session.category}</h3>
                <Badge variant="secondary">{session.totalScore || 0} pts</Badge>
                <Badge variant="outline" className="text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(session.completedAt || session.startedAt)}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {session.totalQuestions || 0} questions
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {(session.accuracyPercentage || 0).toFixed(1)}% accuracy
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(session.timeSpentSeconds)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{session.correctAnswers || 0}/{session.totalQuestions || 0}</div>
              <div className="text-sm text-muted-foreground">correct</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
