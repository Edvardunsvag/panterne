'use client';
import { useEffect, useState } from 'react';
import { useQuizScoring } from '@/hooks/useQuizScoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, Medal, Award } from 'lucide-react';
import { QUIZ_CATEGORIES } from '@/lib/categories';

export const Leaderboard = () => {
  const { loadLeaderboard, leaderboard, loadingLeaderboard, error } = useQuizScoring();
  const [selectedCategory, setSelectedCategory] = useState(QUIZ_CATEGORIES[0]);

  useEffect(() => {
    loadLeaderboard(selectedCategory);
  }, [selectedCategory]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-sm font-bold">{rank}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {QUIZ_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loadingLeaderboard && (
          <p>Loading leaderboard...</p>
        )}
        
        {error && (
          <p className="text-red-500">Error: {error}</p>
        )}
        
        {!loadingLeaderboard && !error && leaderboard.length === 0 && (
          <p className="text-muted-foreground">No scores yet for this category.</p>
        )}
        
        {!loadingLeaderboard && !error && leaderboard.length > 0 && (
          <div className="space-y-3">
            {leaderboard.map((entry) => (
              <div key={`${entry.userName}-${entry.rank}`} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(entry.rank)}
                </div>
                
                <Avatar className="w-10 h-10">
                  <AvatarImage src={entry.avatarUrl} alt={entry.userName} />
                  <AvatarFallback>{entry.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="font-semibold">{entry.userName}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.questionsAnswered} questions • {entry.accuracyPercentage.toFixed(1)}% accuracy
                  </div>
                </div>
                
                <Badge variant="secondary">
                  {entry.totalScore} pts
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
