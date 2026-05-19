import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Clock,
  Award,
  TrendingUp,
  Search,
  Filter,
  Star,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { LearningService, Course } from '../services/learning.service';

export function Learning() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await LearningService.getAllCourses();
    setCourses(data);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty =
      selectedDifficulty === 'all' || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const stats = {
    totalCourses: courses.length,
    completed: courses.filter((c) => c.isCompleted).length,
    inProgress: courses.filter((c) => c.progress > 0 && !c.isCompleted).length,
    totalXP: courses.reduce((sum, c) => sum + (c.isCompleted ? c.xpReward : 0), 0),
  };

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl lg:text-4xl mb-2">
            <span className="text-gradient">Financial Education</span>
          </h1>
          <p className="text-muted-foreground">
            Master the markets through structured courses and interactive quizzes
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Courses', value: stats.totalCourses, icon: GraduationCap, color: 'text-primary' },
            { label: 'Completed', value: stats.completed, icon: Award, color: 'text-chart-3' },
            { label: 'In Progress', value: stats.inProgress, icon: TrendingUp, color: 'text-chart-4' },
            { label: 'XP Earned', value: stats.totalXP, icon: Star, color: 'text-chart-2' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-border/50"
            />
          </div>

          <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <TabsList className="glass">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Beginner">Beginner</TabsTrigger>
              <TabsTrigger value="Intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="Advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <Link to={`/learning/${course.id}`}>
                <Card className="glass glass-hover p-6 h-full flex flex-col group cursor-pointer relative overflow-hidden">
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-chart-2/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                    <Badge
                      variant={
                        course.difficulty === 'Beginner'
                          ? 'default'
                          : course.difficulty === 'Intermediate'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className="text-xs"
                    >
                      {course.difficulty}
                    </Badge>
                  </div>

                  {/* Course Title & Description */}
                  <div className="flex-1 mb-4">
                    <h3 className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Course Meta */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-4 h-4" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-chart-4" />
                        {course.xpReward} XP
                      </div>
                    </div>

                    {/* Progress */}
                    {course.progress > 0 ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary">{course.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    ) : (
                      <Button className="w-full group/btn bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
                        Start Course
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    )}

                    {course.isCompleted && (
                      <div className="flex items-center gap-2 text-sm text-chart-3">
                        <Award className="w-4 h-4" />
                        Completed
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <GraduationCap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No courses found matching your criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
