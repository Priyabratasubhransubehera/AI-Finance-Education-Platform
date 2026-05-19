// Finance Education & Assessment Service
// Manages courses, lessons, quizzes, and user progress

export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  progress: number;
  xpReward: number;
  thumbnail: string;
  category: string;
  isCompleted: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  duration: string;
  order: number;
  isCompleted: boolean;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  courseId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastAccessed: string;
  xpEarned: number;
}

export class LearningService {
  private static readonly COURSES: Course[] = [
    {
      id: 'investing-101',
      title: 'Investing Fundamentals',
      description: 'Learn the basics of stock market investing, from understanding stocks to building your first portfolio.',
      difficulty: 'Beginner',
      duration: '2 hours',
      lessons: 8,
      progress: 0,
      xpReward: 500,
      thumbnail: 'investment-basics',
      category: 'Investing',
      isCompleted: false,
    },
    {
      id: 'technical-analysis',
      title: 'Technical Analysis Mastery',
      description: 'Master chart patterns, indicators, and technical analysis strategies used by professional traders.',
      difficulty: 'Intermediate',
      duration: '4 hours',
      lessons: 12,
      progress: 0,
      xpReward: 800,
      thumbnail: 'technical-analysis',
      category: 'Trading',
      isCompleted: false,
    },
    {
      id: 'portfolio-management',
      title: 'Portfolio Management',
      description: 'Learn how to build, manage, and rebalance a diversified investment portfolio.',
      difficulty: 'Intermediate',
      duration: '3 hours',
      lessons: 10,
      progress: 0,
      xpReward: 700,
      thumbnail: 'portfolio-management',
      category: 'Investing',
      isCompleted: false,
    },
    {
      id: 'risk-management',
      title: 'Risk Management Strategies',
      description: 'Understand and implement effective risk management techniques to protect your capital.',
      difficulty: 'Advanced',
      duration: '3.5 hours',
      lessons: 11,
      progress: 0,
      xpReward: 900,
      thumbnail: 'risk-management',
      category: 'Risk',
      isCompleted: false,
    },
    {
      id: 'ai-investing',
      title: 'AI & Machine Learning in Finance',
      description: 'Explore how artificial intelligence and ML are transforming investment strategies.',
      difficulty: 'Advanced',
      duration: '5 hours',
      lessons: 15,
      progress: 0,
      xpReward: 1000,
      thumbnail: 'ai-finance',
      category: 'Technology',
      isCompleted: false,
    },
  ];

  static async getAllCourses(): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Load progress from localStorage
    const progress = this.loadProgress();
    
    return this.COURSES.map(course => ({
      ...course,
      progress: progress[course.id]?.completedLessons.length / course.lessons * 100 || 0,
      isCompleted: progress[course.id]?.completedLessons.length === course.lessons,
    }));
  }

  static async getCourse(courseId: string): Promise<Course | null> {
    const courses = await this.getAllCourses();
    return courses.find(c => c.id === courseId) || null;
  }

  static async getCourseLessons(courseId: string): Promise<Lesson[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const progress = this.loadProgress();
    const courseProgress = progress[courseId]?.completedLessons || [];
    
    // Generate mock lessons
    const course = await this.getCourse(courseId);
    if (!course) return [];
    
    return Array.from({ length: course.lessons }, (_, i) => ({
      id: `${courseId}-lesson-${i + 1}`,
      courseId,
      title: `Lesson ${i + 1}: ${this.getLessonTitle(courseId, i)}`,
      content: this.getLessonContent(courseId, i),
      duration: `${Math.floor(Math.random() * 20 + 10)} min`,
      order: i + 1,
      isCompleted: courseProgress.includes(`${courseId}-lesson-${i + 1}`),
      quiz: this.generateQuiz(`${courseId}-lesson-${i + 1}`),
    }));
  }

  static async completeLesson(courseId: string, lessonId: string, quizScore?: number): Promise<number> {
    const progress = this.loadProgress();
    
    if (!progress[courseId]) {
      progress[courseId] = {
        courseId,
        completedLessons: [],
        quizScores: {},
        lastAccessed: new Date().toISOString(),
        xpEarned: 0,
      };
    }
    
    if (!progress[courseId].completedLessons.includes(lessonId)) {
      progress[courseId].completedLessons.push(lessonId);
      progress[courseId].xpEarned += 50; // XP per lesson
    }
    
    if (quizScore !== undefined) {
      progress[courseId].quizScores[lessonId] = quizScore;
      progress[courseId].xpEarned += Math.floor(quizScore / 100 * 50); // Bonus XP based on score
    }
    
    progress[courseId].lastAccessed = new Date().toISOString();
    
    this.saveProgress(progress);
    return progress[courseId].xpEarned;
  }

  private static generateQuiz(lessonId: string): Quiz {
    const questions: QuizQuestion[] = [
      {
        id: `${lessonId}-q1`,
        question: 'What is diversification in investing?',
        options: [
          'Investing in only one stock',
          'Spreading investments across different assets',
          'Buying stocks at different times',
          'Selling stocks frequently',
        ],
        correctAnswer: 1,
        explanation: 'Diversification means spreading your investments across different assets to reduce risk.',
      },
      {
        id: `${lessonId}-q2`,
        question: 'What does P/E ratio measure?',
        options: [
          'Company profits',
          'Stock volatility',
          'Price relative to earnings',
          'Market capitalization',
        ],
        correctAnswer: 2,
        explanation: 'P/E (Price-to-Earnings) ratio compares a company\'s stock price to its earnings per share.',
      },
      {
        id: `${lessonId}-q3`,
        question: 'What is a bull market?',
        options: [
          'Market with declining prices',
          'Market with rising prices',
          'Stable market',
          'Volatile market',
        ],
        correctAnswer: 1,
        explanation: 'A bull market is characterized by rising stock prices and investor optimism.',
      },
    ];
    
    return {
      id: `quiz-${lessonId}`,
      lessonId,
      questions,
    };
  }

  private static getLessonTitle(courseId: string, index: number): string {
    const titles: Record<string, string[]> = {
      'investing-101': [
        'Understanding Stocks',
        'Types of Investments',
        'Market Basics',
        'Reading Stock Charts',
        'Risk vs. Return',
        'Investment Accounts',
        'Building Your Portfolio',
        'Long-term Strategies',
      ],
      'technical-analysis': [
        'Introduction to Charts',
        'Candlestick Patterns',
        'Support & Resistance',
        'Moving Averages',
        'RSI & Momentum',
        'Volume Analysis',
        'Chart Patterns',
        'Trend Lines',
        'Fibonacci Retracements',
        'MACD Indicator',
        'Bollinger Bands',
        'Trading Psychology',
      ],
    };
    
    return titles[courseId]?.[index] || `Introduction Topic ${index + 1}`;
  }

  private static getLessonContent(courseId: string, index: number): string {
    return `
# ${this.getLessonTitle(courseId, index)}

This lesson covers essential concepts that will help you understand modern financial markets and investment strategies.

## Key Topics
- Fundamental concepts and definitions
- Practical applications and examples
- Best practices and common pitfalls
- Real-world case studies

## Learning Objectives
By the end of this lesson, you will be able to:
- Understand core principles
- Apply knowledge to real scenarios
- Make informed investment decisions
- Recognize risks and opportunities

Complete the quiz at the end to test your understanding and earn XP!
    `.trim();
  }

  private static loadProgress(): Record<string, UserProgress> {
    const data = localStorage.getItem('wealthnexus_learning_progress');
    return data ? JSON.parse(data) : {};
  }

  private static saveProgress(progress: Record<string, UserProgress>): void {
    localStorage.setItem('wealthnexus_learning_progress', JSON.stringify(progress));
  }
}
