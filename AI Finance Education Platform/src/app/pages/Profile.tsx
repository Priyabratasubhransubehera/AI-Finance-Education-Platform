import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Calendar,
  Award,
  Trophy,
  Flame,
  Star,
  TrendingUp,
  Target,
  Crown,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AuthService } from '../services/auth.service';

export function Profile() {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    const interval = setInterval(() => {
      setUser(AuthService.getCurrentUser());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const progressToNextLevel = ((user.xp % 500) / 500) * 100;
  const xpToNextLevel = 500 - (user.xp % 500);

  const achievements = [
    {
      id: 1,
      title: 'First Login',
      description: 'Welcome to WealthNexus AI!',
      icon: Target,
      unlocked: true,
      xp: 50,
    },
    {
      id: 2,
      title: '7 Day Streak',
      description: 'Logged in for 7 consecutive days',
      icon: Flame,
      unlocked: user.streak >= 7,
      xp: 200,
    },
    {
      id: 3,
      title: 'Course Master',
      description: 'Completed 3 courses',
      icon: Award,
      unlocked: false,
      xp: 300,
    },
    {
      id: 4,
      title: 'Paper Trader',
      description: 'Executed 10 paper trades',
      icon: TrendingUp,
      unlocked: false,
      xp: 150,
    },
    {
      id: 5,
      title: 'Level 10',
      description: 'Reached level 10',
      icon: Crown,
      unlocked: user.level >= 10,
      xp: 500,
    },
  ];

  const stats = [
    {
      label: 'Total XP',
      value: user.xp.toLocaleString(),
      icon: Star,
      color: 'text-chart-4',
    },
    {
      label: 'Level',
      value: user.level,
      icon: Trophy,
      color: 'text-primary',
    },
    {
      label: 'Streak',
      value: `${user.streak} days`,
      icon: Flame,
      color: 'text-destructive',
    },
    {
      label: 'Achievements',
      value: `${achievements.filter((a) => a.unlocked).length}/${achievements.length}`,
      icon: Award,
      color: 'text-chart-3',
    },
  ];

  // Mock leaderboard data
  const leaderboard = [
    { rank: 1, name: 'Alex Johnson', xp: 12500, level: 25 },
    { rank: 2, name: 'Sarah Smith', xp: 10800, level: 22 },
    { rank: 3, name: 'Mike Chen', xp: 9200, level: 19 },
    { rank: 4, name: user.name, xp: user.xp, level: user.level },
    { rank: 5, name: 'Emma Davis', xp: 800, level: 4 },
  ];

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl mb-2">
            <span className="text-gradient">Profile & Achievements</span>
          </h1>
          <p className="text-muted-foreground">
            Track your progress and compete on the leaderboard
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass p-6 lg:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 via-chart-2/10 to-transparent rounded-bl-full" />

            <div className="relative flex flex-col lg:flex-row gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/50">
                <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl">{user.name}</h2>
                  <Badge className="gap-1">
                    <Crown className="w-3 h-3" />
                    Level {user.level}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level Progress</span>
                    <span className="text-primary">
                      {user.xp} XP / {user.level * 500 + 500} XP
                    </span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {xpToNextLevel} XP to reach Level {user.level + 1}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="glass p-4 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <p className="text-2xl mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs: Achievements & Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Tabs defaultValue="achievements">
            <TabsList className="glass w-full">
              <TabsTrigger value="achievements" className="flex-1">
                Achievements
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex-1">
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                  >
                    <Card
                      className={`glass p-6 relative overflow-hidden ${
                        achievement.unlocked ? 'border-primary/50' : 'opacity-60'
                      }`}
                    >
                      {achievement.unlocked && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full" />
                      )}

                      <div className="flex items-start gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            achievement.unlocked ? 'bg-primary/20' : 'bg-secondary/50'
                          }`}
                        >
                          <achievement.icon
                            className={`w-6 h-6 ${
                              achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium">{achievement.title}</h3>
                            {achievement.unlocked && (
                              <Badge variant="default" className="text-xs">
                                +{achievement.xp} XP
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-6">
              <Card className="glass p-6">
                <h3 className="text-lg mb-6">Top Investors</h3>
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg ${
                        entry.name === user.name
                          ? 'bg-primary/10 border border-primary/50'
                          : 'bg-secondary/50'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          entry.rank === 1
                            ? 'bg-chart-4 text-chart-4-foreground'
                            : entry.rank === 2
                            ? 'bg-muted text-muted-foreground'
                            : entry.rank === 3
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-secondary'
                        }`}
                      >
                        {entry.rank}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-medium">{entry.name}</p>
                        <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">{entry.xp.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">XP</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
