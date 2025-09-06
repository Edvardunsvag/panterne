'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crown, Medal, Award, Clock, Calendar, Trophy, Star } from 'lucide-react';
import { useQuizScoring } from '@/components/features/quiz/hooks/useQuizScoring';
import { QUIZ_CATEGORIES } from '@/lib/constants/categories';

export const Leaderboard = () => {
  const { 
    loadLeaderboard, 
    loadDailyLeaderboard, 
    loadHistoricalLeaderboards, 
    loadPodiumStats,
    leaderboard, 
    dailyLeaderboard,
    historicalLeaderboards,
    podiumStats,
    loadingLeaderboard, 
    loadingDailyLeaderboard,
    loadingHistoricalLeaderboards,
    loadingPodiumStats,
    error 
  } = useQuizScoring();
  
  const [selectedCategory, setSelectedCategory] = useState<string>(QUIZ_CATEGORIES[0]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<string>('daily');

  useEffect(() => {
    if (activeTab === 'daily') {
      loadDailyLeaderboard(selectedCategory, selectedDate);
    } else if (activeTab === 'historical') {
      loadHistoricalLeaderboards(selectedCategory, 7);
    } else if (activeTab === 'podium') {
      loadPodiumStats(selectedCategory);
    }
  }, [selectedCategory, selectedDate, activeTab]);

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

  const formatDateOnly = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderLeaderboardEntries = (entries: any[]) => {
    if (entries.length === 0) {
      return (
        <p className="text-muted-foreground">
          No quiz results yet for this category.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div key={`${entry.userName}-${entry.rank || index}-${entry.completedAt || 'unknown'}`} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="flex items-center justify-center w-8">
              {getRankIcon(entry.rank ?? 0)}
            </div>
            
            <Avatar className="w-10 h-10">
              <AvatarImage src={entry.avatarUrl ?? ''} alt={entry.userName ?? ''} />
              <AvatarFallback>{entry.userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="font-semibold">{entry.userName}</div>
              <div className="text-sm text-muted-foreground">
                {entry.questionsAnswered || 0} questions • {(entry.accuracyPercentage || 0).toFixed(1)}% accuracy
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(entry.completedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(entry.timeSpentSeconds)}
                </div>
              </div>
            </div>
            
            <Badge variant="secondary">
              {entry.totalScore || 0} pts
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  const renderPodiumStats = () => {
    if (podiumStats.length === 0) {
      return (
        <p className="text-muted-foreground">
          No podium statistics yet for this category.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {podiumStats.map((stat, index) => (
          <div key={`${stat.userName}-${stat.rank || index}`} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="flex items-center justify-center w-8">
              {getRankIcon(stat.rank ?? 0)}
            </div>
            
            <Avatar className="w-10 h-10">
              <AvatarImage src={stat.avatarUrl ?? ''} alt={stat.userName ?? ''} />
              <AvatarFallback>{stat.userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="font-semibold">{stat.userName}</div>
              <div className="text-sm text-muted-foreground">
                {stat.totalPodiums} total podiums • Weighted Score: {stat.weightedScore}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-500" />
                  {stat.firstPlaceCount} first
                </div>
                <div className="flex items-center gap-1">
                  <Medal className="w-3 h-3 text-gray-400" />
                  {stat.secondPlaceCount} second
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-600" />
                  {stat.thirdPlaceCount} third
                </div>
              </div>
            </div>
            
            <Badge variant="secondary">
              <Trophy className="w-3 h-3 mr-1" />
              {stat.totalPodiums}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  const renderHistoricalLeaderboards = () => {
    if (historicalLeaderboards.length === 0) {
      return (
        <p className="text-muted-foreground">
          No historical leaderboards available for this category.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {historicalLeaderboards.map((dailyBoard) => (
          <div key={dailyBoard.date} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" />
              <h3 className="font-semibold">{formatDateOnly(dailyBoard.date ?? '')}</h3>
              <Badge variant="outline">{dailyBoard.entries?.length ?? 0} participants</Badge>
            </div>
            {dailyBoard.entries?.length && dailyBoard.entries.length > 0 ? (
              <div className="space-y-2">
                {dailyBoard.entries.slice(0, 3).map((entry, index) => (
                  <div key={`${entry.userName}-${index}`} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <div className="flex items-center justify-center w-6">
                      {getRankIcon(entry.rank ?? 0)}
                    </div>
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={entry.avatarUrl ?? ''} alt={entry.userName ?? ''} />
                      <AvatarFallback className="text-xs">{entry.userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{entry.userName}</span>
                    <Badge variant="secondary" className="text-xs">{entry.totalScore} pts</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No participants this day</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const isLoading = loadingLeaderboard || loadingDailyLeaderboard || loadingHistoricalLeaderboards || loadingPodiumStats;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUIZ_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
            <TabsTrigger value="podium">All-Time Podium</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="mt-4">
            <div className="mb-4">
              <label className="text-sm text-muted-foreground">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-2 px-3 py-1 border rounded"
              />
            </div>
            
            {isLoading && <p>Loading daily leaderboard...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!isLoading && !error && renderLeaderboardEntries(dailyLeaderboard)}
          </TabsContent>
          
          <TabsContent value="historical" className="mt-4">
            {isLoading && <p>Loading historical leaderboards...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!isLoading && !error && renderHistoricalLeaderboards()}
          </TabsContent>
          
          <TabsContent value="podium" className="mt-4">
            {isLoading && <p>Loading podium statistics...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {!isLoading && !error && renderPodiumStats()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
