import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  Award,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LearningService, Course, Lesson } from '../services/learning.service';
import { AuthService } from '../services/auth.service';
import { toast } from 'sonner';

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = async () => {
    if (!courseId) return;

    const [courseData, lessonsData] = await Promise.all([
      LearningService.getCourse(courseId),
      LearningService.getCourseLessons(courseId),
    ]);

    setCourse(courseData);
    setLessons(lessonsData);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswers({});
    setQuizScore(null);
  };

  const handleCompleteLesson = async () => {
    if (!selectedLesson || !courseId) return;

    // Start quiz if available
    if (selectedLesson.quiz) {
      setIsQuizOpen(true);
    } else {
      await LearningService.completeLesson(courseId, selectedLesson.id);
      toast.success('+50 XP earned!');
      AuthService.addXP(50);
      setSelectedLesson(null);
      loadCourseData();
    }
  };

  const handleSubmitQuiz = async () => {
    if (!selectedLesson?.quiz || !courseId) return;

    // Calculate score
    const correct = selectedLesson.quiz.questions.filter(
      (q, index) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    const score = (correct / selectedLesson.quiz.questions.length) * 100;

    setQuizScore(score);

    // Award XP
    const xp = await LearningService.completeLesson(courseId, selectedLesson.id, score);
    AuthService.addXP(Math.floor(score / 100 * 50));

    if (score >= 70) {
      toast.success(`Quiz passed! +${Math.floor(score / 100 * 50)} XP`);
      setTimeout(() => {
        setIsQuizOpen(false);
        setSelectedLesson(null);
        loadCourseData();
      }, 2000);
    } else {
      toast.error('Score below 70%. Try again!');
    }
  };

  if (!course) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
        <Link to="/learning">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Button>
        </Link>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{course.category}</Badge>
                  <Badge variant="outline">{course.difficulty}</Badge>
                </div>
                <h1 className="text-3xl mb-3">{course.title}</h1>
                <p className="text-muted-foreground mb-4">{course.description}</p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-chart-4" />
                    {course.xpReward} XP
                  </div>
                </div>
              </div>

              <div className="lg:w-64">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary">{course.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {lessons.filter(l => l.isCompleted).length} of {lessons.length} completed
                  </p>
                </div>

                {course.isCompleted && (
                  <Badge variant="default" className="w-full justify-center gap-2 py-2">
                    <Award className="w-4 h-4" />
                    Course Completed
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Lessons List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass p-6">
            <h2 className="text-xl mb-6">Course Curriculum</h2>

            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className={`
                    p-4 rounded-lg border transition-all cursor-pointer
                    ${lesson.isCompleted
                      ? 'bg-chart-3/10 border-chart-3/50'
                      : 'bg-secondary/50 border-border/50 hover:border-primary/50'
                    }
                  `}
                  onClick={() => handleStartLesson(lesson)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {lesson.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-chart-3" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm mb-1">{lesson.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{lesson.duration}</span>
                        {lesson.quiz && <span>• Quiz included</span>}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={lesson.isCompleted ? 'outline' : 'default'}
                      className="flex-shrink-0"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {lesson.isCompleted ? 'Review' : 'Start'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Lesson Content Dialog */}
      <Dialog open={!!selectedLesson && !isQuizOpen} onOpenChange={(open) => !open && setSelectedLesson(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
          </DialogHeader>

          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm text-muted-foreground">
              {selectedLesson?.content}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedLesson?.quiz ? 'Complete quiz to finish lesson' : 'Mark as complete to earn XP'}
            </p>
            <Button onClick={handleCompleteLesson}>
              {selectedLesson?.quiz ? 'Start Quiz' : 'Complete Lesson'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={isQuizOpen} onOpenChange={setIsQuizOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lesson Quiz</DialogTitle>
          </DialogHeader>

          {quizScore === null ? (
            <div className="space-y-6">
              {selectedLesson?.quiz?.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-3">
                  <p className="font-medium">
                    {qIndex + 1}. {question.question}
                  </p>

                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                          ${quizAnswers[question.id] === oIndex
                            ? 'bg-primary/20 border-primary'
                            : 'bg-secondary/50 border-border/50 hover:border-primary/50'
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          checked={quizAnswers[question.id] === oIndex}
                          onChange={() =>
                            setQuizAnswers({ ...quizAnswers, [question.id]: oIndex })
                          }
                          className="text-primary"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                onClick={handleSubmitQuiz}
                className="w-full"
                disabled={
                  Object.keys(quizAnswers).length !== selectedLesson?.quiz?.questions.length
                }
              >
                Submit Quiz
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4 py-6">
              <div className={`text-6xl ${quizScore >= 70 ? 'text-chart-3' : 'text-destructive'}`}>
                {quizScore.toFixed(0)}%
              </div>
              <p className="text-xl">
                {quizScore >= 70 ? '🎉 Great job!' : '📚 Keep learning!'}
              </p>
              <p className="text-sm text-muted-foreground">
                {quizScore >= 70
                  ? 'You passed the quiz and earned XP!'
                  : 'Score at least 70% to pass. Try again!'}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
