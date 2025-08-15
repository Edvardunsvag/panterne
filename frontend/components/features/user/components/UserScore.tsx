'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import { useUser } from '@/components/features/user/hooks/useUser';

export const UserScore = () => {
  const { user, userScores, loading, error } = useUser();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Scores</CardTitle>
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
          <CardTitle>Your Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!user || userScores.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No scores yet. Start taking quizzes to see your progress!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Scores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userScores.map((score) => (
          <div key={score.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{score.category}</h3>
                <Badge variant="secondary">{score.totalScore} pts</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {score.questionsAnswered} questions
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {score.accuracyPercentage?.toFixed(1) ?? '0.0'}% accuracy
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{score.correctAnswers}/{score.questionsAnswered}</div>
              <div className="text-sm text-muted-foreground">correct</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
