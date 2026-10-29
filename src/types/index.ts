export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface UserProfile {
  id: string;
  fullName: string;
  role: UserRole;
  schoolName: string;
  className: string;
  avatarUrl: string;
  coins: number;
  xp: number;
  level: number;
  rank: number;
  streakDays: number;
  loginId?: string;
  password?: string;
}

export interface LessonMaterial {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  date: string;
  fileType: 'pdf' | 'pptx' | 'doc' | 'video';
  fileSize: string;
  downloadUrl?: string;
  description: string;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  dueDate: string;
  dueTime: string;
  maxCoins: number;
  maxXP: number;
  status: 'new' | 'submitted' | 'under_review' | 'needs_work' | 'graded';
  description: string;
  teacherComment?: string;
  earnedCoins?: number;
  earnedXP?: number;
  studentAnswer?: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  fullName: string;
  avatar: string;
  className: string;
  xp: number;
  coins: number;
  level: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'digital' | 'physical' | 'privilege';
  price: number;
  image: string;
  description: string;
  stock: number;
  isPopular?: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
  progressPercent: number;
}

export interface QuizOption {
  id: number;
  text: string;
  isRight: boolean;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  title: string;
  timeLimit: number;
  points: number;
  coinsReward: number;
  options: QuizOption[];
  explanation?: string;
}

export interface ScheduleItem {
  id: string;
  lessonNumber: number;
  subject: string;
  time: string;
  room: string;
  teacherName: string;
  status: 'upcoming' | 'current' | 'completed';
  topic?: string;
  hasHomework?: boolean;
}
